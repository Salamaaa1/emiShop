import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User, updateProfile, sendPasswordResetEmail } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);
    private router = inject(Router);
    private http = inject(HttpClient);

    user$ = user(this.auth);
    currentUserSig = signal<User | null | undefined>(undefined);
    backendToken: string | null = null;

    constructor() {
        // Sync signal with observable
        this.user$.subscribe(user => {
            this.currentUserSig.set(user);
            if (user) {
                // Refresh backend token on reload if user exists
                this.getBackendToken(user).subscribe();
            } else {
                this.backendToken = null;
                localStorage.removeItem('backend_token');
            }
        });
    }

    private getBackendToken(user: User): Observable<void> {
        return this.http.post<{ token: string }>('http://localhost:3001/api/auth/token', {
            uid: user.uid,
            email: user.email,
            username: user.displayName
        }).pipe(
            tap(response => {
                console.log('AuthService: Backend token received');
                this.backendToken = response.token;
                localStorage.setItem('backend_token', response.token);
            }),
            map(() => void 0),
            catchError(err => {
                console.error('AuthService: Failed to get backend token. Is the server running on port 3001?', err);
                return of(void 0);
            })
        );
    }

    register(email: string, username: string, password: string): Observable<void> {
        console.log('AuthService: Registering user...', { email, username });
        return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
            switchMap((userCredential) => {
                console.log('AuthService: Firebase user created', userCredential.user.uid);
                return from(updateProfile(userCredential.user, { displayName: username })).pipe(
                    map(() => userCredential.user)
                );
            }),
            switchMap((user) => {
                console.log('AuthService: Getting backend token...');
                return this.getBackendToken(user);
            }),
            tap(() => {
                console.log('AuthService: Registration complete, navigating to home');
                this.router.navigate(['/']);
            }),
            catchError(err => {
                console.error('AuthService: Registration failed', err);
                throw err;
            }),
            map(() => void 0)
        );
    }

    login(email: string, password: string): Observable<void> {
        return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
            switchMap((userCredential) => this.getBackendToken(userCredential.user)),
            tap(() => {
                this.router.navigate(['/']);
            }),
            map(() => void 0)
        );
    }

    logout(): Observable<void> {
        return from(signOut(this.auth)).pipe(
            tap(() => {
                this.backendToken = null;
                localStorage.removeItem('backend_token');
                this.router.navigate(['/login']);
            }),
            map(() => void 0)
        );
    }

    resetPassword(email: string): Observable<void> {
        return from(sendPasswordResetEmail(this.auth, email));
    }

    getToken(): string | null {
        return this.backendToken || localStorage.getItem('backend_token');
    }
}
