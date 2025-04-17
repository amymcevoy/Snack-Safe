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

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
