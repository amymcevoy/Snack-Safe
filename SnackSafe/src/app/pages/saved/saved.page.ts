import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';

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
  
  ionViewWillEnter() {
    this.loadScans();
  }

  goHome() {
    this.route.navigate(['/home']);
  }

  async loadScans() {
    const user = this.auth.currentUser;
    if (!user) return;

    const scansRef = collection(this.firestore, 'users', user.uid, 'scans');
    const snapshot = await getDocs(scansRef);

    this.previousScans = snapshot.docs.map(doc => doc.data());
  }
}
