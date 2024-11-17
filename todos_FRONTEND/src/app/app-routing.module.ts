import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { guestGuard } from './guards/guest.guard';

const routes: Routes = [
  { path: '', redirectTo: '/todos', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [guestGuard],
    component: LoginComponent,
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    component: RegisterComponent,
  },
  { path: 'todos', canActivate: [authGuard], component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
