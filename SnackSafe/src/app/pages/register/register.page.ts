import { Component } from '@angular/core';
import { IonicModule} from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule,FormsModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage { 
  name= '';
  email = '';
  password = '';

  constructor(private router: Router) {}

  toAllergy() {
    //remove error
    (document.activeElement as HTMLElement)?.blur();

    console.log('Register clicked:', this.email, this.password);
    
    //if successful
    this.router.navigate(['/allergy-setup']);
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }
}
