import { ParsedResource } from '../types';

/**
 * A simplified HCL parser for the MVP.
 * Extracts instances from AWS, Azure, and GCP resources.
 */
export const parseTerraformContent = (content: string): ParsedResource[] => {
  const resources: ParsedResource[] = [];
  const lines = content.split('\n');
  
  const SUPPORTED_TYPES = new Set([
    'aws_instance',
    'azurerm_linux_virtual_machine',
    'azurerm_windows_virtual_machine',
    'azurerm_virtual_machine', // older azurerm
    'google_compute_instance'
  ]);

  // Simple state machine
  let currentBlock: Partial<ParsedResource> | null = null;
  let braceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for resource start
    // Matches: resource "type" "name" {
    const resourceMatch = line.match(/^resource\s+"([^"]+)"\s+"([^"]+)"\s*\{?$/);
    
    if (resourceMatch && !currentBlock) {
      const type = resourceMatch[1];
      const name = resourceMatch[2];
      
      if (SUPPORTED_TYPES.has(type)) {
        currentBlock = {
          id: `${type}.${name}`,
          name: name,
          type: type,
          properties: {},
          rawLocation: i + 1
        };
        braceCount = line.endsWith('{') ? 1 : 0;
      }
    } else if (currentBlock) {
      // We are inside a block
      if (line.includes('{')) braceCount++;
      if (line.includes('}')) braceCount--;

      // Parse properties
      // This is a naive regex that captures basic key="value" pairs.
      const propMatch = line.match(/^([a-zA-Z0-9_]+)\s*=\s*"([^"]+)"/);
      if (propMatch) {
        const key = propMatch[1];
        const value = propMatch[2];
        if (currentBlock.properties) {
          currentBlock.properties[key] = value;
        }
      }

      // Check for end of block
      if (braceCount === 0 && line.endsWith('}')) {
        resources.push(currentBlock as ParsedResource);
        currentBlock = null;
      }
    }
  }

  // Fallback: Fuzzy scan for properties if block parsing failed (e.g. strange formatting)
  if (resources.length === 0) {
    // AWS
    [...content.matchAll(/instance_type\s*=\s*"([^"]+)"/g)].forEach((match, index) => {
      resources.push({
        id: `unknown_aws_${index}`,
        name: `Detected AWS Instance ${index + 1}`,
        type: 'aws_instance',
        properties: { instance_type: match[1] }
      });
    });

    // GCP
    [...content.matchAll(/machine_type\s*=\s*"([^"]+)"/g)].forEach((match, index) => {
      resources.push({
        id: `unknown_gcp_${index}`,
        name: `Detected GCP Instance ${index + 1}`,
        type: 'google_compute_instance',
        properties: { machine_type: match[1] }
      });
    });
    
    // Azure (size matches are risky, so we skip fuzzy match for generic 'size' to avoid false positives)
  }

  return resources;
};