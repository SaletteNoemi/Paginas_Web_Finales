import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})



export class LoginComponent implements OnInit {
  
  form: any = {
    correo: null,
    contrasena: null
  };


  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private storageService: StorageService, private router: Router) { }

  private dash_url = 'dashboard/'
  private pharmacy_url = '/pharmacy'
  private gov_url = '/mod'

  ngOnInit(): void {

    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      const id_cliente = this.storageService.getUser().id;

      const pharmacy = ['ROLE_PHARMACY'];
      const mod = ['ROLE_GOV'];

      if(this.roles == pharmacy){
        this.router.navigate([`${this.pharmacy_url}`]);
      }
      else if (this.roles == mod) {
        this.router.navigate([`${this.gov_url}`]);
      }
      else{
        this.router.navigate([`${this.dash_url}/${id_cliente}`]);  
      };

      }
  }


  onSubmit(): void {
    const { correo, contrasena} = this.form;

    this.authService.login(correo, contrasena).subscribe({
      next: data => {
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
