import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})

export class ResultsPage {
  product: any;

  private router = inject(Router);
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  constructor(){
    const nav = this.router.getCurrentNavigation();
    this.product = nav?.extras.state?.['product'] || history.state['product'];
  }

  async saveScan() {
    const user = this.auth.currentUser;
    if (!user || !this.product) return;

    try {
      const scansRef = collection(this.firestore, 'users', user.uid, 'scans');
      await addDoc(scansRef, {
        ...this.product,
        savedAt: new Date()
      });
      alert('✅ Scan saved successfully!');
      this.router.navigateByUrl('/scan');
    } catch (err) {
      console.error('Save failed:', err);
      alert(' Failed to save scan.');
    }
  }
  
  goBack() {
    this.router.navigateByUrl('/scan');
  }
}
