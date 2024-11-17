import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './pages/home/home.component';
import { TodoCardComponent } from './components/todo-card/todo-card.component';
import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { AuthInterceptor } from './utils/auth.interceptor';
import { IfAuthenticatedDirective } from './directives/if-authenticated.directive';
import { NavUserComponent } from './components/nav-user/nav-user.component';
import { AssignComponent } from './components/assign/assign.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ShowDetailsComponent } from './components/show-details/show-details.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TodoCardComponent,
    AddTodoComponent,
    LoginComponent,
    IfAuthenticatedDirective,
    NavUserComponent,
    AssignComponent,
    ConfirmDialogComponent,
    ShowDetailsComponent,
    RegisterComponent,
    LoaderComponent,
    NotificationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbToast,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
