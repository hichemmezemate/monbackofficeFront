import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule,MatIconModule, FormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  
  constructor(private loginService: LoginService, private router: Router) {}
  
  isLogged: boolean = false
  error: string = ""


  ngOnInit() {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.router.navigate(['/interface']);
    }
  }

  login() {
    this.loginService.login(this.username, this.password).subscribe({
      next: (data) => {
        this.isLogged = this.loginService.isAuthenticated()
        localStorage.setItem('access_token',data.access)
        localStorage.setItem('refresh_token',data.refresh)
        this.router.navigate(['/interface'])
      },
      error: (error) => {
        console.error('Login failed:', error.message);
        this.error = "Identifiants erronés"
      }
    });
  }

}
