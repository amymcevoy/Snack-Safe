import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})

export class RegisterPage {

  name: string = '';
  email: string = '';
  password: string = '';
  
  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);

  showForm = false;

  ionViewDidEnter() {
    const inputs = document.querySelectorAll('ion-input input');
    inputs.forEach((el: any) => {
      el.removeAttribute('aria-hidden');
      el.removeAttribute('tabindex');
      el.removeAttribute('disabled')
      el.disabled = false;
      el.style.pointerEvents = 'auto';
      el.style.opacity = '1';
      el.style.border = '1px solid #092c3e';
      el.style.padding = '12px';
      el.style.fontSize = '15px';
      el.style.borderRadius = '8px';
    });
  
    const parents = document.querySelectorAll('[aria-hidden="true"]');
    parents.forEach((el: any) => {
      el.removeAttribute('aria-hidden');
      el.style.display = 'block';
    });
  }
  

  async register() {

    if (!this.name || !this.email || !this.password) {
      console.error('Please fill in all fields.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;

      // Save user data to Firestore
      const userDoc = doc(this.firestore, 'users', user.uid);
      await setDoc(userDoc, { name: this.name }, { merge: true });

      console.log('User registered:', user.email);
      this.router.navigateByUrl('/allergy-setup', { replaceUrl: true });

    } catch (error: any) {
      alert(`Registration Failed Please Try Again!`);
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  onEmailChange(event: any) {
    this.email = event.target.value;
  }

  onPasswordChange(event: any) {
    this.password = event.target.value;
  }
}
