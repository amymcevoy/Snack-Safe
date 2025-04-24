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

@Component({
  selector: 'app-saved',
  templateUrl: './saved.page.html',
  styleUrls: ['./saved.page.scss'],
  standalone: true,
  imports: [IonicModule, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})

export class SavedPage {

  previousScans: any[] = [];

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private route = inject(Router);
  
  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.loadScans(user.uid);
      } else {
        console.warn('User not logged in');
      }
    });
  }

  goHome() {
    this.route.navigate(['/home']);
  }

  async loadScans(uid: string) {
    const scansRef = collection(this.firestore, 'users', uid, 'scans');
    const snapshot = await getDocs(scansRef);

    this.previousScans = snapshot.docs.map(doc => doc.data());
  }
}
