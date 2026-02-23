import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { User, AuthResponse, LoginCredentials, RegisterData } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = 'http://localhost:3000/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';

  // Signals
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Public computed signals
  currentUser = this.currentUserSignal.asReadonly();
  isLoading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();
  isAuthenticated = computed(() => !!this.currentUserSignal());
  isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  constructor() {
    // Auto-load user if token exists
    if (this.getToken()) {
      this.loadCurrentUser();
    }
  }

  /**
   * Register new user
   */
  register(data: RegisterData): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap(response => {
        console.log('Registration response:', response);
        if (response.success) {
          this.handleAuthSuccess(response.data);
        }
      }),
      catchError(error => {
        this.errorSignal.set(error.error?.message || 'Registration failed');
        this.loadingSignal.set(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSignal.set(false))
    );
  }

  /**
   * Login user
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response.success) {
          this.handleAuthSuccess(response.data);
        }
      }),
      catchError(error => {
        this.errorSignal.set(error.error?.message || 'Login failed');
        this.loadingSignal.set(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSignal.set(false))
    );
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/logout`, {}).pipe(
      tap(() => {
        this.clearAuthData();
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        // Even if API fails, clear local data
        this.clearAuthData();
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  /**
   * Load current user from API
   */
  loadCurrentUser(): void {
    this.http.get<any>(`${this.API_URL}/me`).subscribe({
      next: (response) => {
        if (response.success) {
          this.currentUserSignal.set(response.data.user);
          this.saveUserToStorage(response.data.user);
        }
      },
      error: () => {
        this.clearAuthData();
      }
    });
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<any>(`${this.API_URL}/refresh`, { refreshToken }).pipe(
      tap(response => {
        if (response.success) {
          this.saveToken(response.data.token);
          this.saveRefreshToken(response.data.refreshToken);
        }
      })
    );
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(data: any): void {
    this.saveToken(data.token);
    this.saveRefreshToken(data.refreshToken);
    this.saveUserToStorage(data.user);
    this.currentUserSignal.set(data.user);
    this.router.navigate(['/dashboard']);
  }

  /**
   * Clear all auth data
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
  }

  /**
   * Token management
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private saveRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  /**
   * User storage management
   */
  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.errorSignal.set(null);
  }
}