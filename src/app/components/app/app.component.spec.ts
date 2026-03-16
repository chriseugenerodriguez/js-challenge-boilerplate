import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { PolicyValidationService } from '../../services/policy-validation.service';
import { PolicyApiService } from '../../services/policy-api.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: any;
  let policyValidationService: jasmine.SpyObj<PolicyValidationService>;
  let policyApiService: jasmine.SpyObj<PolicyApiService>;

  beforeEach(async () => {
    const policyValidationSpy = jasmine.createSpyObj('PolicyValidationService', ['validatePolicies']);
    const policyApiSpy = jasmine.createSpyObj('PolicyApiService', ['submitPolicies']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: PolicyValidationService, useValue: policyValidationSpy },
        { provide: PolicyApiService, useValue: policyApiSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    policyValidationService = TestBed.inject(PolicyValidationService) as jasmine.SpyObj<PolicyValidationService>;
    policyApiService = TestBed.inject(PolicyApiService) as jasmine.SpyObj<PolicyApiService>;
  });

  afterEach(() => {
    // Cleanup
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'kin-ocr' title`, () => {
    expect(component.title).toEqual('kin-ocr');
  });

  it('should initialize with empty policies array', () => {
    expect(component.policies).toEqual([]);
  });

  it('should have file error empty on init', () => {
    expect(component.fileError).toEqual('');
  });

  it('should render title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Policy Number Validator'
    );
  });

  describe('File Upload', () => {
    let originalFileReader: any;
    let mockFileContent: string;

    beforeEach(() => {
      // Mock FileReader
      originalFileReader = globalThis.FileReader;
      mockFileContent = '457508000,664371495'; // Default content
      const mockFileReader = function(this: any) {
        this.onload = null;
        this.readAsText = function(file: File) {
          // Simulate successful read
          setTimeout(() => {
            if (this.onload) {
              this.onload({ target: { result: mockFileContent } });
            }
          }, 0);
        };
      };
      (globalThis as any).FileReader = mockFileReader;
    });

    afterEach(() => {
      (globalThis as any).FileReader = originalFileReader;
    });

    it('should handle file selection with valid CSV', (done) => {
      mockFileContent = '457508000,664371495';
      const mockFile = new File([mockFileContent], 'test.csv', { type: 'text/csv' });
      const mockEvent = {
        target: { files: [mockFile] }
      } as any;

      policyValidationService.validatePolicies.and.returnValue([
        { policyNumber: 457508000, result: 'valid' },
        { policyNumber: 664371495, result: 'error' }
      ]);

      component.onFileSelected(mockEvent);

      // Wait for async file reading
      setTimeout(() => {
        expect(component.fileError).toBe('');
        expect(component.policies.length).toBe(2);
        expect(component.policies[0].policyNumber).toBe(457508000);
        expect(component.policies[0].result).toBe('Valid');
        done();
      }, 10);
    });

    it('should reject non-CSV files', () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const mockEvent = {
        target: { files: [mockFile] }
      } as any;

      component.onFileSelected(mockEvent);

      expect(component.fileError).toBe('Please upload a CSV file');
      expect(component.policies).toEqual([]);
    });

    it('should reject files larger than 2MB', () => {
      // Create a file larger than 2MB by creating a blob
      const largeContent = new Array(300000).fill('1,').join(''); // This creates a large string
      const blob = new Blob([largeContent], { type: 'text/csv' });
      Object.defineProperty(blob, 'size', { value: 3 * 1024 * 1024 }); // 3MB
      const mockFile = blob as File;
      Object.defineProperty(mockFile, 'name', { value: 'large.csv' });
      Object.defineProperty(mockFile, 'type', { value: 'text/csv' });

      const mockEvent = {
        target: { files: [mockFile] }
      } as any;

      component.onFileSelected(mockEvent);

      expect(component.fileError).toBe('File size must not exceed 2MB');
    });

    it('should handle empty file selection', () => {
      const mockEvent = {
        target: { files: [] }
      } as any;

      component.onFileSelected(mockEvent);

      expect(component.fileError).toBe('');
    });

    it('should handle invalid CSV content', (done) => {
      mockFileContent = 'invalid,text,here';
      const mockFile = new File([mockFileContent], 'test.csv', { type: 'text/csv' });
      const mockEvent = {
        target: { files: [mockFile] }
      } as any;

      component.onFileSelected(mockEvent);

      setTimeout(() => {
        expect(component.fileError).toContain('Error parsing CSV');
        done();
      }, 10);
    });
  });

  describe('API Submission', () => {
    beforeEach(() => {
      component.validationResults = [
        { policyNumber: 457508000, result: 'valid' }
      ];
    });

    it('should submit policies successfully', fakeAsync(() => {
      const mockResponse = { id: 101 };
      policyApiService.submitPolicies.and.returnValue(of(mockResponse));

      component.submitToApi();
      tick();

      expect(component.isLoading).toBe(false);
      expect(component.hasSubmitted).toBe(true);
      expect(component.submitMessage).toBe('Success! Submitted with ID: 101');
      expect(component.submitMessageType).toBe('success');
    }));

    it('should handle API submission error', fakeAsync(() => {
      const mockError = { error: { message: 'Server error' } };
      policyApiService.submitPolicies.and.returnValue(throwError(() => mockError));

      component.submitToApi();
      tick();

      expect(component.isLoading).toBe(false);
      expect(component.hasSubmitted).toBe(true);
      expect(component.submitMessage).toContain('Error submitting policies');
      expect(component.submitMessageType).toBe('error');
    }));

    it('should not submit when no validation results', () => {
      component.validationResults = [];
      component.submitToApi();

      expect(policyApiService.submitPolicies).not.toHaveBeenCalled();
    });
  });

  describe('Reset Functionality', () => {
    beforeEach(() => {
      component.policies = [{ policyNumber: 123, result: 'Valid' }];
      component.validationResults = [{ policyNumber: 123, result: 'valid' }];
      component.fileError = 'Some error';
      component.submitMessage = 'Some message';
      component.submitMessageType = 'success';
      component.hasSubmitted = true;
    });

    it('should reset all state', () => {
      component.reset();

      expect(component.policies).toEqual([]);
      expect(component.validationResults).toEqual([]);
      expect(component.fileError).toBe('');
      expect(component.submitMessage).toBe('');
      expect(component.submitMessageType).toBe(null);
      expect(component.hasSubmitted).toBe(false);
    });
  });

  describe('Submit Button State', () => {
    it('should enable submit when there are validation results and not loading', () => {
      component.validationResults = [{ policyNumber: 123, result: 'valid' }];
      component.isLoading = false;

      expect(component.canSubmit()).toBe(true);
    });

    it('should disable submit when loading', () => {
      component.validationResults = [{ policyNumber: 123, result: 'valid' }];
      component.isLoading = true;

      expect(component.canSubmit()).toBe(false);
    });

    it('should disable submit when no validation results', () => {
      component.validationResults = [];
      component.isLoading = false;

      expect(component.canSubmit()).toBe(false);
    });
  });
});
