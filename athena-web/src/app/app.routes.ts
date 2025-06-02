import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { CodeProcessorComponent } from './code-processor/code-processor.component';

export const routes: Routes = [
  { path: 'intro', component: CodeProcessorComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent},
  { path: '', redirectTo: '/intro', pathMatch: 'full' },
  { path: '**', redirectTo: '/intro' },
];
