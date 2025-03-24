import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  rememberEmail = false;
  private readonly EMAIL_STORAGE_KEY = 'todo_app_saved_email';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      rememberEmail: [false]
    });
  }

  ngOnInit(): void {
    // Retrieve remember email preference
    this.rememberEmail = localStorage.getItem('todo_app_remember_email') === 'true';
    
    // Retrieve saved email if option is enabled
    if (this.rememberEmail) {
      const savedEmail = localStorage.getItem(this.EMAIL_STORAGE_KEY);
      if (savedEmail) {
        this.loginForm.patchValue({ email: savedEmail });
      }
    }
    
    // Redirect if already logged in
    if (this.authService.getCurrentUser()) {
      this.router.navigate(['/tasks']);
    }
  }

  toggleRememberEmail(): void {
    this.rememberEmail = !this.rememberEmail;
    localStorage.setItem('todo_app_remember_email', this.rememberEmail.toString());
    
    if (!this.rememberEmail) {
      // If option is disabled, remove saved email
      localStorage.removeItem(this.EMAIL_STORAGE_KEY);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const email = this.loginForm.get('email')?.value;
      
      // Save email if option is enabled
      if (this.rememberEmail) {
        localStorage.setItem(this.EMAIL_STORAGE_KEY, email);
      }
      
      this.authService.login(email).subscribe({
        next: () => {
          this.isLoading = false;
          // Show welcome message
          this.snackBar.open('Welcome back!', 'Close', { 
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.isLoading = false;
          this.openRegisterDialog(email);
        }
      });
    }
  }

  private openRegisterDialog(email: string): void {
    const dialogRef = this.dialog.open(UserRegisterDialogComponent, {
      width: '400px',
      data: { email }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.authService.register(email).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Account created successfully! Welcome to TODO App', 'Close', { 
              duration: 4000,
              panelClass: 'success-snackbar' 
            });
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open('Error creating user. Please try again.', 'Close', { 
              duration: 4000,
              panelClass: 'error-snackbar'
            });
            console.error('Registration error:', error);
          }
        });
      }
    });
  }

  onRegister(email: string): void {
    if (email) {
      this.authService.register(email).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error: any) => {
          console.error('Registration error:', error);
          // Handle the error appropriately
        }
      });
    }
  }
}

@Component({
  selector: 'app-user-register-dialog',
  template: `
    <div class="register-dialog-container">
      <div class="dialog-icon-container">
        <mat-icon class="dialog-icon">person_add</mat-icon>
      </div>
      <h2 mat-dialog-title class="dialog-title">Account not found</h2>
      
      <mat-dialog-content class="dialog-content">
        <p>We couldn't find an account associated with <strong>{{data.email}}</strong></p>
        <p>Would you like to create a new account with this email?</p>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close class="cancel-button">Cancel</button>
        <button mat-raised-button color="primary" [mat-dialog-close]="true" class="confirm-button">
          Create account
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .register-dialog-container {
      padding: 0 20px 20px;
    }
    .dialog-icon-container {
      display: flex;
      justify-content: center;
      margin-top: 16px;
      margin-bottom: 8px;
    }
    .dialog-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #3f51b5;
    }
    .dialog-title {
      text-align: center;
      margin-bottom: 16px;
      color: #333;
      font-weight: 500;
    }
    .dialog-content {
      text-align: center;
      margin-bottom: 16px;
      color: #555;
    }
    .confirm-button {
      margin-left: 8px;
    }
    strong {
      color: #3f51b5;
      font-weight: 500;
    }
  `]
})
export class UserRegisterDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserRegisterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {email: string}
  ) {}
}
