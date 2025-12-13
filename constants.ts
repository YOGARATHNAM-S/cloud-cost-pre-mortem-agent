// Simplified Pricing Maps for MVP
// In a real app, this would fetch from the Cloud Pricing APIs

export const AWS_PRICES: Record<string, number> = {
  // General Purpose
  't2.nano': 4.16,
  't2.micro': 8.32,
  't2.small': 16.64,
  't2.medium': 33.28,
  't2.large': 66.56,
  't2.xlarge': 133.12,
  't2.2xlarge': 266.24,
  
  't3.nano': 3.72,
  't3.micro': 7.44,
  't3.small': 14.88,
  't3.medium': 29.76,
  't3.large': 59.52,
  't3.xlarge': 119.04,
  't3.2xlarge': 238.08,

  'm5.large': 69.12,
  'm5.xlarge': 138.24,
  'm5.2xlarge': 276.48,
  'm5.4xlarge': 552.96,
  
  // Compute Optimized
  'c5.large': 61.20,
  'c5.xlarge': 122.40,
  'c5.2xlarge': 244.80,

  // Memory Optimized
  'r5.large': 90.72,
  'r5.xlarge': 181.44,
};

export const AZURE_PRICES: Record<string, number> = {
  // Burstable (B-series)
  'Standard_B1ls': 3.80,
  'Standard_B1s': 7.59,
  'Standard_B1ms': 15.18,
  'Standard_B2s': 30.36,
  'Standard_B2ms': 60.72,
  
  // General Purpose (D-series)
  'Standard_D2s_v3': 96.00,
  'Standard_D4s_v3': 192.00,
  'Standard_D8s_v3': 384.00,
  
  // Compute Optimized (F-series)
  'Standard_F2s_v2': 85.00,
  'Standard_F4s_v2': 170.00,
};

export const GCP_PRICES: Record<string, number> = {
  // E2 Series (General Purpose / Cost Optimized)
  'e2-micro': 6.11,
  'e2-small': 12.23,
  'e2-medium': 24.46,
  'e2-standard-2': 48.92,
  'e2-standard-4': 97.84,

  // N1 Series
  'n1-standard-1': 24.27,
  'n1-standard-2': 48.54,
  'n1-standard-4': 97.08,
  
  // N2 Series
  'n2-standard-2': 48.54,
  'n2-standard-4': 97.08,
};

export const DEFAULT_AWS_TYPE = 't2.micro';
export const DEFAULT_AZURE_TYPE = 'Standard_B1s';
export const DEFAULT_GCP_TYPE = 'e2-micro';

export const EXPENSIVE_THRESHOLD = 100; // USD per month to trigger warning