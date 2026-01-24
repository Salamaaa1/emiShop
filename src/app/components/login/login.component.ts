import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    email = '';
    password = '';
    errorMessage = '';

    private authService = inject(AuthService);

    onSubmit() {
        if (this.email.trim().toLowerCase() === 'admin') {
            this.email = 'admin@emishop.com';
        }

        this.authService.login(this.email, this.password).subscribe({
            next: () => {
                // Navigation handled in service
            },
            error: (err) => {
                this.errorMessage = err.message;
            }
        });
    }

}
