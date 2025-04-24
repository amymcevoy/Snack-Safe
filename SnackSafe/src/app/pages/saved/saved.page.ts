import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { doc, deleteDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-saved',
  templateUrl: './saved.page.html',
  styleUrls: ['./saved.page.scss'],
  standalone: true,
  imports: [IonicModule, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})

export class SavedPage {

  // Track loading state and saved scans
  loading: boolean = true;
  previousScans: any[] = [];

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private route = inject(Router);
  
  // Waits for auth and then load scans
  ngOnInit() {
    this.waitForAuth().then(user => {
      if (user) {
         this.loadScans(user.uid);
      } else {
        console.warn('User not logged in');
      }
    });
  }

  // Waits for logged in user 
  waitForAuth(): Promise<any> {
    const auth = getAuth();
    return new Promise(resolve => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe(); // Stop listening once user found
        resolve(user);
      });
    });
  }

  // Navigate back to home
  goHome() {
    this.route.navigate(['/home']);
  }

  // Loads all saved scans from users firestore collection
  async loadScans(uid: string) {
    this.loading = true;

    const scansRef = collection(this.firestore, 'users', uid, 'scans');
    const snapshot = await getDocs(scansRef);

    // Map document into an array and stores ID's
    this.previousScans = snapshot.docs.map(doc => ({
      id: doc.id,   // Needed to identify which scan to delete  
      ...doc.data() 
    }));
    this.loading = false;
  }

  // Deletes scaan by document ID
  async deleteScan(scanId: string) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
  
    const scanDocRef = doc(this.firestore, 'users', user.uid, 'scans', scanId);
  
    try {
      await deleteDoc(scanDocRef);

      // Updates local state to remove deleted scan from list
      this.previousScans = this.previousScans.filter(scan => scan.id !== scanId);
      console.log('Scan deleted:', scanId);
    } catch (err) {
      console.error('Error deleting scan:', err);
    }
  }
}
