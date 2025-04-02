import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButton]
})
export class HomePage{

  constructor(private router: Router) { }
  goToScan() {
    this.router.navigate(['/scan']);
  }

  goToAllergySetup() {
    this.router.navigate(['/allergy-setup']);
  }

  logout() {
    this.router.navigate(['/auth']); // or add Firebase logout later

  }
}
