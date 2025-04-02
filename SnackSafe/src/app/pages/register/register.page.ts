import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage { email = '';
  password = '';

  constructor(private router: Router) {}

  register() {
    //remove error
    (document.activeElement as HTMLElement)?.blur();

    console.log('Register clicked:', this.email, this.password);
    
    //if successful
    this.router.navigate(['/home']);
  }
}
