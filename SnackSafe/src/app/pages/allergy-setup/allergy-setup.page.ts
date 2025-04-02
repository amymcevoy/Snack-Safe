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

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  async save() {
    const chosen = Object.keys(this.selected).filter(key => this.selected[key]);
    const user = await this.afAuth.currentUser;

    if (user) {
      await this.firestore
        .collection('users')
        .doc(user.uid)
        .set({ allergens: chosen }, { merge: true });
        
    console.log('Selected allergens:', chosen);
  }

}

