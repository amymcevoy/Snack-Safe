import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})

export class ResultsPage {
  product: any;

  private router = inject(Router);

  constructor(){
    const nav = this.router.getCurrentNavigation();
    this.product = nav?.extras.state?.['product'] || history.state['product'];
  }
  
  goBack() {
    this.router.navigateByUrl('/scan');
  }
}
