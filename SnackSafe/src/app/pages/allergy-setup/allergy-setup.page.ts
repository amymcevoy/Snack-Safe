import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar ,IonToggle,IonItem,IonList,IonLabel,IonButton} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth,  } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-allergy-setup',
  templateUrl: './allergy-setup.page.html',
  styleUrls: ['./allergy-setup.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonToggle,IonItem,IonList,IonLabel,IonButton,CommonModule, FormsModule]
})
export class AllergySetupPage{
  
  // List of most common allergens for user
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
  
  // Tracks which allergies are selected
  selectedAllergens: { [key: string]: boolean } = {};

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  // Called when page is about to open
  ionViewWillEnter() {
    this.loadAllergens();
  }

  // Saves selected allergens to document in firestore
  async save() {
    const user = this.auth.currentUser;

    if (!user) {
      console.error('No user logged in.');
      return;
    }

    // Gets only selected allergens
    const chosen = Object.keys(this.selectedAllergens).filter(key => this.selectedAllergens[key]);

  try{
    const userDoc = doc(this.firestore, 'users', user.uid);
    await setDoc(userDoc, { allergens: chosen }, { merge: true });
    console.log('Saved allergens:', chosen);

    // Navigates to home after saving
    this.router.navigate(['/home'])
  } catch(error){
    console.error('Failed to save allergens:', error);

  }
 }

 // Loads previously saved allergens and toggles
 async loadAllergens() {
  const user = this.auth.currentUser;
  if (!user) return;

  const userDoc = doc(this.firestore, 'users', user.uid);
  const snapshot = await getDoc(userDoc);

  if (snapshot.exists()) {
    const data = snapshot.data();
    const savedAllergens: string[] = data['allergens'] || [];

    // Reset all toggles
    this.selectedAllergens = {};
    for (let allergen of this.allergenList) {
      this.selectedAllergens[allergen] = savedAllergens.includes(allergen);
      }
    }
  }
}
