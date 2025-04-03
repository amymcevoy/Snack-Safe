import { Component ,inject} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({

  selector: 'app-login',
  standalone: true,
  imports: [IonicModule,FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})

export class LoginPage {
    email = '';
    password = '';

    private auth = inject(Auth);
    private router = inject(Router);

    async login(){
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
            console.log('Logged in user:', userCredential.user);
        //if successful
        this.router.navigate(['/home']);
        } catch (err: any) {
            console.error('Login failed:', err.message);
        }
    }

    goToRegister() {
        this.router.navigate(['/register']);
    }
}

