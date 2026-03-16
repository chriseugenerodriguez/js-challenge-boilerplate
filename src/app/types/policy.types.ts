export interface PolicyValidationResult {
  policyNumber: number;
  result: 'valid' | 'error' | 'AMB' | 'corrected';
}

export interface DisplayPolicy {
  policyNumber: number;
  result: string;
  isLoading?: boolean;
}