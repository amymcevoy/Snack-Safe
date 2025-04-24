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

  // Holds result of a scan
  scanResult: {
    name: string;
    code: string;
    allergens?: string[];
    mayContain?: string[];
    traceDebug?: string[];
  } | null = null;
  
  // Holds error message
  scanError: string = '';

  private router = inject(Router);
  private auth = inject(Auth);
  private firestore = inject(Firestore);

 // Scans barcode using camera 
 async scanBarcode(){

    try{      
    // Open camera and get a photo as data URL
      const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
      });

      if (!image.dataUrl) {
        this.scanError = 'No image captured.';
        return;
      }

      // Decode the barcode from image
      const reader = new BrowserMultiFormatReader();
      const img = new Image();
      
      const code = await new Promise<string>((resolve, reject) => {
      img.onload = async () => {
        try{
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas context is null');
      
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const result = await reader.decodeFromCanvas(canvas);
          resolve(result.getText());
        } catch (decodeErr) {
          reject('No barcode found in the image.');
        }
      };

      img.onerror = () => reject('Image could not be processed.');
      img.src = image.dataUrl!;
    });

          // Fetchs product info from open food facts
          const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
          const data = await response.json();

          if (data.status !== 1) {
            this.scanError = 'Product not found';
            return;
          }

          // Process allergen data
          const productName = data.product.product_name || 'Unnamed Product';
          const allergensTags = (data.product.allergens_tags || []).map((a: string) => a.replace('en:', '').toLowerCase());
    
          const rawTraceTags = (data.product.traces_tags || []).map((tag: string) =>
            tag.replace('en:', '').replace(/[-_]/g, ' ').toLowerCase()
          );
      
          const tracesRaw = (data.product.traces || '').toLowerCase();
          const tracesList = tracesRaw
            .split(/[,.;]/)
            .map((s: string) => s.trim().toLowerCase().replace(/[-_]/g, ' '))
            .filter(Boolean);
      
          const combinedTraces = [...rawTraceTags, ...tracesList];
      
          // Allergen map for detection
          const allergenMap: { [key: string]: string[] } = {
            'dairy': ['milk', 'lactose', 'milkprotein','skimmed milk','cheese', 'butter', 'cream'],
            'tree nuts': ['nuts', 'almonds', 'walnuts', 'cashews', 'hazelnuts','pecans', 'pistachios', 'macadamia'],
            'gluten': ['gluten', 'wheat','barley', 'rye', 'spelt'],
            'soy': ['soy', 'soya','soybeans','soy lecithin'],
            'peanuts': ['peanuts', 'groundnuts'],
            'egg': ['egg','eggwhite', 'egg yolk'],
            'fish': ['fish','anchovy', 'salmon', 'tuna', 'cod'],
            'shellfish': ['shellfish', 'crustaceans','oyester', 'oyester-extract','shrimp', 'lobster', 'crab'],
          };

          const user = this.auth.currentUser;
          let contains: string[] = [];
          let mayContain: string[] = [];

      // Compares allergens to users selection
      if (user) {
        const userDoc = doc(this.firestore, 'users', user.uid);
        const userSnap = await getDoc(userDoc);
        const userAllergies = userSnap.exists() ? userSnap.data()['allergens'] || [] : [];

          userAllergies.forEach((userAllergen: string) => {
          const aliases = allergenMap[userAllergen.toLowerCase()] || [];

          const isInAllergens = aliases.some(alias => allergensTags.includes(alias));
          const isInTraces = aliases.some(alias => combinedTraces.includes(alias));
          
          if (isInAllergens) {
            contains.push(userAllergen);
          } else if (isInTraces) {
            mayContain.push(userAllergen);
          }
        });

          // Stores scan result
          this.scanResult = {
          name: productName,
          code,
          allergens: contains.length ? contains : ['None detected'],
          mayContain: mayContain.length ? mayContain : ['None'],
        };

        // Navigates to results page
          this.router.navigateByUrl('/results', {
          state: { product: this.scanResult }
        });
            this.scanError = '';

      }  else {
        this.scanError = 'Product not found in the database.';
      }
    } catch (err) {
      console.error('Scan error:', err);
      this.scanResult = null;
      this.scanError = typeof err === 'string' ? err : 'Scan failed, try again.';
    }
  }

  // Navigate back home
  goHome() {
    this.router.navigate(['/home']);
  }

  // Navigate to saved scans
  goToSaved(){
    this.router.navigate(['/saved']);
  }

  // Uploads image to firebase storage and link to scan result
  async uploadImage(dataUrl: string) {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, 'images/' + new Date().toISOString());
  
      // Upload the image data to Firebase Storage
      const uploadResult = await uploadString(imageRef, dataUrl, 'data_url');
  
      // Get the URL of the uploaded image
      const url = await getDownloadURL(uploadResult.ref);
      console.log('Image uploaded to Firebase Storage:', url);
  
      // Saves this URL to Firestore along with scan data
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
