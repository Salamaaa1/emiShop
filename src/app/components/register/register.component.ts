import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    email = '';
    username = '';
    password = '';
    errorMessage = '';

    private authService = inject(AuthService);

    onSubmit() {
        this.authService.register(this.email, this.username, this.password).subscribe({
            next: () => {
                // Navigation handled in service
            },
            error: (err) => {
                console.error('RegisterComponent: Registration error', err);
                this.errorMessage = err.message;
            }
        });
    }
}
