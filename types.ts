export interface ParsedResource {
  id: string;
  name: string;
  type: string; // e.g., 'aws_instance'
  properties: Record<string, string>;
  rawLocation?: number; // Line number
}

export interface CostItem {
  resourceName: string;
  instanceType: string;
  monthlyCost: number;
  isEstimate: boolean;
  provider: 'AWS' | 'Azure' | 'GCP' | 'Unknown';
}

export interface OptimizationSuggestion {
  resourceName: string;
  currentType: string;
  suggestion: string;
  potentialSavings: string;
  reasoning: string;
}

export interface AnalysisResult {
  rawText: string;
  suggestions: OptimizationSuggestion[];
}