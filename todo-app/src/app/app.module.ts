import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Módulos
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

// Componentes
import { AppComponent } from './app.component';
import { LoginComponent, UserRegisterDialogComponent } from './components/login/login.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskItemComponent } from './components/task-item/task-item.component';
import { EditTaskDialogComponent } from './components/task-list/edit-task-dialog/edit-task-dialog.component';
import { DeleteTaskDialogComponent } from './components/task-list/delete-task-dialog/delete-task-dialog.component';

// Interceptores
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserRegisterDialogComponent,
    TaskListComponent,
    TaskFormComponent,
    TaskItemComponent,
    EditTaskDialogComponent,
    DeleteTaskDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 