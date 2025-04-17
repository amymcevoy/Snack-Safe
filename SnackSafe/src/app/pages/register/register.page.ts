import { Component ,inject} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { Auth,createUserWithEmailAndPassword} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule,FormsModule,CommonModule, ReactiveFormsModule  ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})

export class RegisterPage { 

  registerForm!: FormGroup;
  
  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);
  private fb = inject(FormBuilder);

  constructor() {
  this.registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
}

  ionViewDidEnter() {
    const blockers = document.querySelectorAll('[aria-hidden="true"]');
    blockers.forEach(el => el.removeAttribute('aria-hidden'));
  }
  
  async register() {

    if (this.registerForm.invalid) return;

    const { name, email, password } = this.registerForm.value;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      const userDoc = doc(this.firestore, 'users', user.uid);
      await setDoc(userDoc, { name }, { merge: true })

      console.log('User registered:', user.email);
      this.router.navigateByUrl('/allergy-setup', { replaceUrl: true });

    } catch (error: any) {
      console.error('Registration failed:', error.message);
    }
  }

  goToLogin(){
    this.router.navigateByUrl('/login', { replaceUrl: true });

  }
}
