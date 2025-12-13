import { 
  AWS_PRICES, DEFAULT_AWS_TYPE,
  AZURE_PRICES, DEFAULT_AZURE_TYPE,
  GCP_PRICES, DEFAULT_GCP_TYPE
} from '../constants';
import { ParsedResource, CostItem } from '../types';

type ProviderInfo = {
  provider: 'AWS' | 'Azure' | 'GCP';
  defaultType: string;
  priceMap: Record<string, number>;
  key: string;
};

const getProviderInfo = (resourceType: string): ProviderInfo | null => {
  if (resourceType.startsWith('aws')) {
    return { 
      provider: 'AWS', 
      defaultType: DEFAULT_AWS_TYPE, 
      priceMap: AWS_PRICES, 
      key: 'instance_type' 
    };
  }
  if (resourceType.startsWith('azurerm')) {
    return { 
      provider: 'Azure', 
      defaultType: DEFAULT_AZURE_TYPE, 
      priceMap: AZURE_PRICES, 
      key: 'size' 
    };
  }
  if (resourceType.startsWith('google')) {
    return { 
      provider: 'GCP', 
      defaultType: DEFAULT_GCP_TYPE, 
      priceMap: GCP_PRICES, 
      key: 'machine_type' 
    };
  }
  return null;
};

export const calculateCosts = (resources: ParsedResource[]): CostItem[] => {
  return resources.map((resource): CostItem | null => {
    const info = getProviderInfo(resource.type);
    
    // If resource type is unknown to our pricing engine, skip or handle generic
    if (!info) return null;

    // Try to get type from properties using the provider-specific key
    const rawType = resource.properties[info.key];
    const instanceType = rawType || info.defaultType;
    
    // Lookup price
    const price = info.priceMap[instanceType] || info.priceMap[info.defaultType];
    
    // Check if we actually found the specific price or used a fallback
    const isExactMatch = info.priceMap.hasOwnProperty(instanceType);

    return {
      resourceName: resource.name,
      instanceType: isExactMatch ? instanceType : `${instanceType} (?)`,
      monthlyCost: price,
      isEstimate: !isExactMatch,
      provider: info.provider
    };
  }).filter((item): item is CostItem => item !== null);
};

export const getTotalCost = (items: CostItem[]): number => {
  return items.reduce((acc, item) => acc + item.monthlyCost, 0);
};