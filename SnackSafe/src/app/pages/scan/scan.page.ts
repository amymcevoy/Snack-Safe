import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButton,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
  photo: string | null = null;

async takePhoto() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    if (image.dataUrl) {
      this.photo = image.dataUrl;
      console.log('Photo captured!');
      await this.uploadImage(image.dataUrl);
    } else {
      this.photo = null; // Handle undefined case
    }
  } catch (err) {
    console.error('Camera error:', err);
  }
}

  
 async scanBarcode(){

    try{      
      const result = await BarcodeScanner.scan();

      if (result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue || 'N/A';
  
        const productAllergens = ['Milk', 'Nuts']
  
        // Step 2: Save scan to Firestore
        const user = this.auth.currentUser;
        let matchedAllergens: string[] = [];

        if (user) {
          const userDoc = doc(this.firestore, 'users', user.uid);
          const userSnap = await getDoc(userDoc);
          const userAllergies = userSnap.exists() ? userSnap.data()['allergens'] || [] : [];
  
          matchedAllergens = productAllergens.filter(a => userAllergies.includes(a));

       const scanData = {
          name: 'Sample Product', // 🔁 Replace with actual name if possible
          code,
          allergens: matchedAllergens.length ? matchedAllergens : ['None detected'],
          timestamp: new Date()
        };

        this.scanResult = scanData;

        // Step 3: Navigate to results with scan data
        this.router.navigateByUrl('/results', {
          state: { product: this.scanResult }
        });

        this.scanError = '';
      }
  
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

  async uploadImage(dataUrl: string) {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, 'images/' + new Date().toISOString());
  
      // Upload the image data to Firebase Storage
      const uploadResult = await uploadString(imageRef, dataUrl, 'data_url');
  
      // Get the URL of the uploaded image
      const url = await getDownloadURL(uploadResult.ref);
      console.log('Image uploaded to Firebase Storage:', url);
  
      // Optionally, save this URL to Firestore along with scan data
      if (this.scanResult) {
        const user = this.auth.currentUser;
        if (user) {
          const scansRef = collection(this.firestore, 'users', user.uid, 'scans');
          await addDoc(scansRef, {
            ...this.scanResult,
            imageUrl: url,  // Save the URL of the image
            timestamp: new Date()
          });
          console.log('Scan saved with image URL!');
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }
  

}