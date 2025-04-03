import { Component ,inject} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth,createUserWithEmailAndPassword} from '@angular/fire/auth';

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

  private auth = inject(Auth);
  private router = inject(Router);

  async register() {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      console.log('User registered:', userCredential.user);
      this.router.navigate(['/allergy-setup']);
    } catch (error: any) {
      console.error('Registration failed:', error.message);
    }
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }
}
