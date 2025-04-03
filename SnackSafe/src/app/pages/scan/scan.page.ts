import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButton]
})

export class ScanPage {

  scanResult: {
    name: string;
    code: string;
    allergens?: string[];
  } | null = null;
  
  
  scanError: string = '';
  

  scanBarcode(){

    try{
      //Result for now
      this.scanResult = {
        name: 'Snickers Bar',
        code: '12345678',
        allergens: ['Peanuts','Dairy']
      };

      this.scanError = '';
      
    } catch (err){

      this.scanResult = null;
      this.scanError = 'Scan failed, try again';
    }
  }
}