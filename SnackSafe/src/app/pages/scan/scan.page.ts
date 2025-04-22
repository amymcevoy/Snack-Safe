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
import { BrowserMultiFormatReader } from '@zxing/browser';

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

 async scanBarcode(){

    try{      
    // Open camera and get a photo
      const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
      });

      if (!image.dataUrl) {
        this.scanError = 'No image captured.';
        return;
      }

      const reader = new BrowserMultiFormatReader();
      const img = new Image();
      
      img.onload = async () => {
        try{
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas context is null');
      
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
          const result = await reader.decodeFromCanvas(canvas);
          const code = result.getText();
          const productAllergens = ['Milk', 'Nuts'];
          const user = this.auth.currentUser;
          let matchedAllergens: string[] = [];
  
        if (user) {
          const userDoc = doc(this.firestore, 'users', user.uid);
          const userSnap = await getDoc(userDoc);
          const userAllergies = userSnap.exists() ? userSnap.data()['allergens'] || [] : [];
  
          matchedAllergens = productAllergens.filter(a => userAllergies.includes(a));

          this.scanResult = {
          name: 'Sample Product',
          code,
          allergens: matchedAllergens.length ? matchedAllergens : ['None detected'],
        };
        

        // Step 3: Navigate to results with scan data
        this.router.navigateByUrl('/results', {
          state: { product: this.scanResult }
        });
        

        this.scanError = '';
      }
    } catch (decodeErr) {
      console.error('Barcode decoding failed:', decodeErr);
      this.scanError = 'No barcode found in the image.';
    }
  };

  img.onerror = () => {
    console.error('Image failed to load.');
    this.scanError = 'Image could not be processed.';
  };

  img.src = image.dataUrl;
  
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
