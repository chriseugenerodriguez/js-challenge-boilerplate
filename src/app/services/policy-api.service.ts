import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PolicyValidationResult } from '../types';

export interface ApiResponse {
  userId?: number;
  id: number;
  title?: string;
  body?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PolicyApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  /**
   * Post validated policy numbers to the API
   */
  submitPolicies(policies: PolicyValidationResult[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      title: 'Policy Validation Report',
      body: JSON.stringify(policies),
      userId: 1
    });
  }
}
