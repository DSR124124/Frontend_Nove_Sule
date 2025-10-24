import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse, ApiResponse } from '../models/login-response.model';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`;
  private readonly validateUrl = `${API_BASE_URL}${AUTH_ENDPOINTS.VALIDATE}`;

  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Cargar usuario del localStorage al inicializar
    this.loadUserFromStorage();
  }

  /**
   * Inicia sesión con username y password
   */
  login(loginRequest: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(this.baseUrl, loginRequest)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setCurrentUser(response.data);
          }
        })
      );
  }

  /**
   * Valida un token JWT
   */
  validateToken(token: string): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(this.validateUrl, null, {
      params: { token }
    });
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    const token = this.getToken();
    return !!(user && token);
  }

  /**
   * Obtiene el token JWT
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Establece el usuario actual y guarda en localStorage
   */
  private setCurrentUser(user: LoginResponse): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', user.token);
  }

  /**
   * Carga el usuario desde localStorage
   */
  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.logout();
      }
    }
  }
}
