import { Component ,inject} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { Auth,createUserWithEmailAndPassword} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule,FormsModule,CommonModule, ReactiveFormsModule  ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage { 
  name= '';
  email = '';
  password = '';

  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);

  async register() {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;

      const userDoc = doc(this.firestore, 'users', user.uid);
      await setDoc(userDoc, { name: this.name }, { merge: true });
  
      console.log('User registered:', user.email);
      this.router.navigate(['/allergy-setup']);
    } catch (error: any) {
      console.error('Registration failed:', error.message);
    }
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }
}
