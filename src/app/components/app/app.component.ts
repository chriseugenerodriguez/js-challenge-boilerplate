import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PolicyValidationService } from '../../services/policy-validation.service';
import { PolicyApiService } from '../../services/policy-api.service';
import { DisplayPolicy, PolicyValidationResult } from '../../types';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    providers: [PolicyValidationService, PolicyApiService]
})
export class AppComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  title = 'kin-ocr';
  policies: DisplayPolicy[] = [];
  validationResults: PolicyValidationResult[] = [];
  
  // UI states
  isLoading = false;
  submitMessage = '';
  submitMessageType: 'success' | 'error' | null = null;
  fileError = '';
  hasSubmitted = false;

  constructor(
    private policyValidationService: PolicyValidationService,
    private policyApiService: PolicyApiService
  ) {}

  /**
   * Handle CSV file selection
   */
  onFileSelected(event: Event): void {
    this.fileError = '';
    this.submitMessage = '';
    this.submitMessageType = null;

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      this.fileError = 'Please upload a CSV file';
      return;
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      this.fileError = 'File size must not exceed 2MB';
      return;
    }

    // Read and parse CSV
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        this.parseAndValidateCsv(csv);
      } catch (error) {
        this.fileError = 'Error reading file. Please ensure it is a valid CSV.';
      }
    };

    reader.readAsText(file);
  }

  /**
   * Parse CSV and validate policy numbers
   */
  private parseAndValidateCsv(csv: string): void {
    try {
      // Split by comma and filter out empty values
      const policyNumbers = csv
        .split(',')
        .map(num => num.trim())
        .filter(num => num.length > 0)
        .map(num => {
          const parsed = parseInt(num, 10);
          if (isNaN(parsed)) {
            throw new Error(`Invalid number: ${num}`);
          }
          return parsed;
        });

      if (policyNumbers.length === 0) {
        this.fileError = 'CSV file contains no valid policy numbers';
        return;
      }

      // Validate all policies
      this.validationResults = this.policyValidationService.validatePolicies(policyNumbers);
      
      // Create display policies
      this.policies = this.validationResults.map(result => ({
        policyNumber: result.policyNumber,
        result: this.getResultDisplay(result.result)
      }));

      this.fileError = '';
    } catch (error) {
      this.fileError = `Error parsing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.policies = [];
      this.validationResults = [];
    }
  }

  /**
   * Get user-friendly result display text
   */
  private getResultDisplay(result: string): string {
    const resultMap: { [key: string]: string } = {
      'valid': 'Valid',
      'error': 'Error',
      'AMB': 'Ambiguous',
      'corrected': 'Corrected'
    };
    return resultMap[result] || result;
  }

  /**
   * Submit policies to API
   */
  submitToApi(): void {
    if (this.validationResults.length === 0) {
      return;
    }

    this.isLoading = true;
    this.submitMessage = '';
    this.submitMessageType = null;

    this.policyApiService.submitPolicies(this.validationResults).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.hasSubmitted = true;
        this.submitMessage = `Success! Submitted with ID: ${response.id}`;
        this.submitMessageType = 'success';
      },
      error: (error) => {
        this.isLoading = false;
        this.hasSubmitted = true;
        const errorMsg = error?.error?.message || 'Unknown error occurred';
        this.submitMessage = `Error submitting policies: ${errorMsg}. Please try again.`;
        this.submitMessageType = 'error';
      }
    });
  }

  /**
   * Reset the form
   */
  reset(): void {
    this.policies = [];
    this.validationResults = [];
    this.fileError = '';
    this.submitMessage = '';
    this.submitMessageType = null;
    this.hasSubmitted = false;
    
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  /**
   * Check if submit button should be enabled
   */
  canSubmit(): boolean {
    return this.validationResults.length > 0 && !this.isLoading;
  }
}
