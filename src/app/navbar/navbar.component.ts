import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router: Router, private loginService: LoginService) {}

  logout() {
    this.loginService.logout()
    localStorage.clear()
    this.router.navigate(["/"])
  }

  goDashboard() {
    this.router.navigate(["/dashboard"])
  }

  goHome() {
    this.router.navigate(["/interface"])
  }
}
