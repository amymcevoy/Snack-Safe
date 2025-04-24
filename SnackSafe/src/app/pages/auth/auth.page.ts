import { IonicModule } from '@ionic/angular';
import { Component } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})

export class AuthPage {
  constructor(private router: Router) {}

  // Navigates to Login
  goToLogin() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  // Navigates to Register
  goToRegister() {
    this.router.navigateByUrl('/register', { replaceUrl: true });

  }
}
