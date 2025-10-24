import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MessageService } from './message.service';
import { API_BASE_URL } from '../constants/api-endpoints';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {

  constructor(
    protected http: HttpClient,
    protected messageService: MessageService
  ) { }

  /**
   * Obtiene el token del localStorage
   */
  protected getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Crea headers con autorización
   */
  protected getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Realiza una petición GET
   */
  protected get<T>(endpoint: string): Observable<T> {
    return this.http.get<ApiResponse<T>>(`${API_BASE_URL}${endpoint}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Error en la petición');
      }),
      catchError(error => {
        this.messageService.handleHttpError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Realiza una petición POST
   */
  protected post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${API_BASE_URL}${endpoint}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Error en la petición');
      }),
      catchError(error => {
        this.messageService.handleHttpError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Realiza una petición PUT
   */
  protected put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${API_BASE_URL}${endpoint}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Error en la petición');
      }),
      catchError(error => {
        this.messageService.handleHttpError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Realiza una petición DELETE
   */
  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${API_BASE_URL}${endpoint}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Error en la petición');
      }),
      catchError(error => {
        this.messageService.handleHttpError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Realiza una petición PATCH
   */
  protected patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${API_BASE_URL}${endpoint}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Error en la petición');
      }),
      catchError(error => {
        this.messageService.handleHttpError(error);
        return throwError(() => error);
      })
    );
  }
}
