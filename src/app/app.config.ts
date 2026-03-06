import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { firebaseConfig } from '../firebaseconfig';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideHttpClient } from '@angular/common/http';
import { getStorage, provideStorage } from '@angular/fire/storage';


export const appConfig: ApplicationConfig = {
  providers: [

    // Global Error Handler
    provideBrowserGlobalErrorListeners(),

    // Angular Router
    provideRouter(routes),

    // Firebase Initialize
    provideFirebaseApp(() => initializeApp(firebaseConfig)),

    // Firestore Database
    provideFirestore(() => getFirestore()),

    // ⭐ Firebase Storage (Video Upload ke liye)
    provideStorage(() => getStorage())

  ]
};
