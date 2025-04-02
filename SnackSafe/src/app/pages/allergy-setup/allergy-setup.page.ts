import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar ,IonCheckbox,IonItem,IonList,IonLabel,IonButton} from '@ionic/angular/standalone';

import { inject } from '@angular/core';
import { Auth, getAuth } from '@angular/fire/auth';
import { Firestore, getFirestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-allergy-setup',
  templateUrl: './allergy-setup.page.html',
  styleUrls: ['./allergy-setup.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonCheckbox,IonItem,IonList,IonLabel,IonButton,CommonModule, FormsModule]
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


  async save() {

    const auth = getAuth();
    const firestore = getFirestore();
  
    const chosen = Object.keys(this.selectedAllergens).filter(key => this.selectedAllergens[key]);
    const user = auth.currentUser;

    if (user) {
      const userDoc = doc(firestore, 'users', user.uid);
      await setDoc(userDoc, { allergens: chosen }, { merge: true });

    console.log('Selected allergens:', chosen);
  }
  }
}
