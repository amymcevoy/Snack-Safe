import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.page.html',
  styleUrls: ['./saved.page.scss'],
  standalone: true,
  imports: [IonicModule, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})

export class SavedPage {

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }

//Examples for now
  previousScans = [
    {
      name: 'Snickers Bar',
      date: 'April 2, 2025',
      allergens: ['Peanuts', 'Dairy']
    },
  ];
}
