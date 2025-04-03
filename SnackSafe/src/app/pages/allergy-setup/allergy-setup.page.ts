import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar ,IonToggle,IonItem,IonList,IonLabel,IonButton} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, getAuth } from '@angular/fire/auth';
import { Firestore, getFirestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-allergy-setup',
  templateUrl: './allergy-setup.page.html',
  styleUrls: ['./allergy-setup.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonToggle,IonItem,IonList,IonLabel,IonButton,CommonModule, FormsModule]
})
export class AllergySetupPage{
  
  allergenList: string[] = [
    'Peanuts',
    'Tree Nuts',
    'Dairy',
    'Eggs',
    'Gluten',
    'Soy',
    'Fish',
    'Shellfish'
  ];
  
  selectedAllergens: { [key: string]: boolean } = {};

  constructor(private router: Router) {}

  async save() {

    const chosen = Object.keys(this.selectedAllergens).filter(key => this.selectedAllergens[key]);
   

    console.log('Selected allergens:', chosen);

    console.log('Navigating to home...');
    this.router.navigate(['/home'])
  }
}
