import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButton]
})

export class ScanPage {

  scanResult: {
    name: string;
    code: string;
    allergens?: string[];
  } | null = null;
  
  scanError: string = '';

  private router = inject(Router);
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  
 async scanBarcode(){

    try{      
      const user = this.auth.currentUser;
      if (user) {
        const scansRef = collection(this.firestore, 'users', user.uid, 'scans');
        await addDoc(scansRef, {
          ...this.scanResult,
          timestamp: new Date()
        });
        console.log('Scan saved!');
      }

      this.scanError = '';

      this.router.navigateByUrl('/results', {
        state: { product: this.scanResult }
      });
   
    } catch (err){

      this.scanResult = null;
      this.scanError = 'Scan failed, try again';
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }

}