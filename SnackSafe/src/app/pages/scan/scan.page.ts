import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';


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
      const result = await BarcodeScanner.scan();

      if (result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue || 'N/A';
  
        // Example scan result (mocked product info)
        this.scanResult = {
          name: 'Sample Product',
          code,
          allergens: ['Milk', 'Nuts'] // You can replace with real lookup later
        };
  
        // Step 2: Save scan to Firestore
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
  
        // Step 3: Navigate to results with scan data
        this.router.navigateByUrl('/results', {
          state: { product: this.scanResult }
        });
  
      } else {
        this.scanError = 'No barcode found.';
      }
  
    } catch (err) {
      console.error(err);
      this.scanResult = null;
      this.scanError = 'Scan failed, try again.';
    }
  }
  goHome() {
    this.router.navigate(['/home']);
  }

}