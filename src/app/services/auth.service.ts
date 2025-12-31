import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User, updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);
    private router = inject(Router);

    user$ = user(this.auth);
    currentUserSig = signal<User | null | undefined>(undefined);

    constructor() {
        // Sync signal with observable
        this.user$.subscribe(user => {
            this.currentUserSig.set(user);
        });
    }

    register(email: string, username: string, password: string): Observable<void> {
        return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
            switchMap((userCredential) => {
                return from(updateProfile(userCredential.user, { displayName: username }));
            }),
            tap(() => {
                this.router.navigate(['/']);
            }),
            map(() => void 0)
        );
    }

    login(email: string, password: string): Observable<void> {
        return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
            tap(() => {
                this.router.navigate(['/']);
            }),
            map(() => void 0)
        );
    }

    logout(): Observable<void> {
        return from(signOut(this.auth)).pipe(
            tap(() => {
                this.router.navigate(['/login']);
            }),
            map(() => void 0)
        );
    }
}
