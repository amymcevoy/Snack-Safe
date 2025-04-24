import { Component ,inject} from '@angular/core';
import { IonicModule ,AlertController} from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({

  selector: 'app-login',
  standalone: true,
  imports: [IonicModule,FormsModule,ReactiveFormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})

export class LoginPage {

    // Email and password fields
    email = '';
    password = '';

    private auth = inject(Auth);
    private router = inject(Router);

    // Logs user in using credentials
    async login(){
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
            console.log('Logged in user:', userCredential.user);
       
         // If successful brings user to homepage
        this.router.navigate(['/home']);
        } catch (err: any) {
            const errorCode = err.code;
            let message = 'Login failed. Please try again.';
          
            // Error messages based on firebase errors
            if (errorCode === 'auth/user-not-found') {
              message = 'No account found with this email.';
            } else if (errorCode === 'auth/wrong-password') {
              message = 'Incorrect password.';
            } else if (errorCode === 'auth/invalid-email') {
              message = 'Invalid email address.';
            }
            
            // Show error alert
            alert(`Login Failed , Email or Password is incorrect!`);
        }
    }

    // Navigates to register page
    goToRegister() {
        this.router.navigate(['/register']);
    }
}

