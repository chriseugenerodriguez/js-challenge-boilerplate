import { Injectable } from '@angular/core';
import { PolicyValidationResult } from '../types';
import { DIGIT_SWAPS } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class PolicyValidationService {
  // Mapping of digits that could be confused during scanning
  private readonly digitSwaps = DIGIT_SWAPS;

  /**
   * Calculate checksum for a policy number
   * Formula: (d1+(2*d2)+(3*d3)+...+(9*d9)) mod 11 = 0
   * where d1 is the rightmost digit
   */
  calculateChecksum(policyNumber: number | string): number {
    const digits = policyNumber.toString().padStart(9, '0');
    let sum = 0;

    for (let i = 0; i < digits.length; i++) {
      const digitValue = parseInt(digits[digits.length - 1 - i], 10);
      const multiplier = i + 1; // Position from right, starting at 1
      sum += digitValue * multiplier;
    }

    return sum % 11;
  }

  /**
   * Check if a policy number is valid
   */
  isValidPolicyNumber(policyNumber: number | string): boolean {
    return this.calculateChecksum(policyNumber) === 0;
  }

  /**
   * Try to correct an invalid policy number by swapping confused digits
   * Returns the corrected number if found, null otherwise
   */
  attemptCorrection(policyNumber: string): {
    validNumber: number | null;
    correctionCount: number;
    candidates: number[];
  } {
    const candidates: number[] = [];

    // Try swapping each digit position
    for (let pos = 0; pos < policyNumber.length; pos++) {
      const currentDigit = policyNumber[pos];
      const possibleSwaps = this.digitSwaps[currentDigit as keyof typeof this.digitSwaps] || [];

      for (const swapDigit of possibleSwaps) {
        const correctedNumber = 
          policyNumber.substring(0, pos) + 
          swapDigit + 
          policyNumber.substring(pos + 1);

        const numericValue = parseInt(correctedNumber, 10);
        
        if (this.isValidPolicyNumber(correctedNumber)) {
          if (!candidates.includes(numericValue)) {
            candidates.push(numericValue);
          }
        }
      }
    }

    return {
      validNumber: candidates.length === 1 ? candidates[0] : null,
      correctionCount: candidates.length,
      candidates: candidates.sort((a, b) => a - b)
    };
  }

  /**
   * Validate and process a policy number
   */
  validatePolicyNumber(policyNumber: number): PolicyValidationResult {
    const policyStr = policyNumber.toString().padStart(9, '0');

    if (this.isValidPolicyNumber(policyStr)) {
      return {
        policyNumber,
        result: 'valid'
      };
    }

    // Try to correct the number
    const correction = this.attemptCorrection(policyStr);

    if (correction.correctionCount === 0) {
      return {
        policyNumber,
        result: 'error'
      };
    } else if (correction.correctionCount === 1 && correction.validNumber !== null) {
      return {
        policyNumber: correction.validNumber,
        result: 'corrected'
      };
    } else {
      // Multiple candidates or ambiguous
      return {
        policyNumber,
        result: 'AMB'
      };
    }
  }

  /**
   * Validate multiple policy numbers
   */
  validatePolicies(policyNumbers: number[]): PolicyValidationResult[] {
    return policyNumbers.map(num => this.validatePolicyNumber(num));
  }
}
