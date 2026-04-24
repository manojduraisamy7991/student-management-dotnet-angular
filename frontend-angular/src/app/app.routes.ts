import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { SignupComponent } from './features/auth/signup/signup';
import { DashboardComponent } from './features/dashboard/dashboard';
import { StudentFormComponent } from './features/student-form/student-form';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'student/new', component: StudentFormComponent, canActivate: [authGuard] },
  { path: 'student/edit/:id', component: StudentFormComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
