import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';

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
import { httpInterceptorProviders } from './interceptors';

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
    MaterialModule,
    MatPaginatorModule
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 