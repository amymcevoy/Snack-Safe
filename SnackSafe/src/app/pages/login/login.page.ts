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
    email = '';
    password = '';

    private auth = inject(Auth);
    private router = inject(Router);
    private alertCtrl = inject(AlertController);


    async login(){
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
            console.log('Logged in user:', userCredential.user);
        //if successful
        this.router.navigate(['/home']);
        } catch (err: any) {
            const errorCode = err.code;
            let message = 'Login failed. Please try again.';
          
            if (errorCode === 'auth/user-not-found') {
              message = 'No account found with this email.';
            } else if (errorCode === 'auth/wrong-password') {
              message = 'Incorrect password.';
            } else if (errorCode === 'auth/invalid-email') {
              message = 'Invalid email address.';
            }
            
            this.showError(message);
        }
    }

    async showError(message: string) {
        const alert = await this.alertCtrl.create({
          header: 'Login Failed',
          message,
          buttons: ['OK']
        });
        await alert.present();
      }

    goToRegister() {
        this.router.navigate(['/register']);
    }
}

