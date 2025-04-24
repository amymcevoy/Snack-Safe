import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Auth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButton]
})

export class HomePage{

  // Default username placeholder
  userName: string = 'User';

  private router = inject(Router);
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  ionViewWillEnter() {
    this.loadUserName();
  }

  // Fetches users name from firestore
  async loadUserName() {
    const user = this.auth.currentUser;
    if (!user) return;

    const userDoc = doc(this.firestore, 'users', user.uid);
    const snapshot = await getDoc(userDoc);

    if (snapshot.exists()) {
      const data = snapshot.data();
      this.userName = data['name'] || 'User';
    }
  }

  // Navigates to Scan page
  goToScan() {
    this.router.navigate(['/scan']);
  }

  // Navigates to allergy page
  goToAllergySetup() {
    this.router.navigate(['/allergy-setup']);
  }

  // Navigates to previously scanned page
  goToSaved(){
    this.router.navigate(['/saved']);
  }

  // Logs user out entirely and redirects to auth page
  async logout() {
    
    await signOut(this.auth); 
    console.log('User signed out');
    this.router.navigate(['/auth']);

  } catch (error: any) {
    console.error('Logout error:', error);
  }
}
