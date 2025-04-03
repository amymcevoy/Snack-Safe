import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule,FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})

export class LoginPage {
    email = '';
    password = '';

    constructor(private router: Router){}

    login(){
        console.log("Login clicked: ", this.email,this.password);
        
        //if successful
        this.router.navigate(['/home']);
    }

    goToRegister() {
        this.router.navigate(['/register']);

    }
}
