import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyAkfbOcwSZY_a1Q_LkxXNJXeHHCiWtEVw0",
  authDomain: "emishop-37e87.firebaseapp.com",
  projectId: "emishop-37e87",
  storageBucket: "emishop-37e87.firebasestorage.app",
  messagingSenderId: "902226491288",
  appId: "1:902226491288:web:09591820621bf2c58bdded",
  measurementId: "G-TF09Y5J1G1"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ]
};
