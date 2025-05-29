import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from './enviroments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    // Initialize Firebase
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()),

    // Import HTTP and Router modules
    importProvidersFrom(HttpClientModule),
    provideRouter(routes),
    provideHttpClient(withFetch()),
  ],

}).catch((err) => console.error(err));
