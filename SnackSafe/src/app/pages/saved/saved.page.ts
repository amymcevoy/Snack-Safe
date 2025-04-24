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

  loading: boolean = true;
  previousScans: any[] = [];

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private route = inject(Router);
  
  ngOnInit() {
    this.waitForAuth().then(user => {
      if (user) {
         this.loadScans(user.uid);
      } else {
        console.warn('User not logged in');
      }
    });
  }

  waitForAuth(): Promise<any> {
    const auth = getAuth();
    return new Promise(resolve => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe(); // Stop listening after first result
        resolve(user);
      });
    });
  }

  goHome() {
    this.route.navigate(['/home']);
  }

  async loadScans(uid: string) {
    this.loading = true;

    const scansRef = collection(this.firestore, 'users', uid, 'scans');
    const snapshot = await getDocs(scansRef);

    this.previousScans = snapshot.docs.map(doc => ({
      id: doc.id,           // 🔥 Needed to delete the correct document
      ...doc.data()
    }));
    this.loading = false;
  }

  async deleteScan(scanId: string) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
  
    const scanDocRef = doc(this.firestore, 'users', user.uid, 'scans', scanId);
  
    try {
      await deleteDoc(scanDocRef);
      this.previousScans = this.previousScans.filter(scan => scan.id !== scanId);
      console.log('Scan deleted:', scanId);
    } catch (err) {
      console.error('Error deleting scan:', err);
    }
  }
}
