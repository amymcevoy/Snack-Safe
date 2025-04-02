import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar ,IonCheckbox,IonItem,IonList,IonLabel} from '@ionic/angular/standalone';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-allergy-setup',
  templateUrl: './allergy-setup.page.html',
  styleUrls: ['./allergy-setup.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonCheckbox,IonItem,IonList,IonLabel,CommonModule, FormsModule]
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
  
  selected: { [key: string]: boolean } = {};

  constructor() {}

  save() {
    const chosen = Object.keys(this.selected).filter(key => this.selected[key]);
    console.log('Selected allergens:', chosen);
  }

}

