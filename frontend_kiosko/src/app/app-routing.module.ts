import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardGovComponent } from './board-gov/board-gov.component';
import { BoardPharmacyComponent } from './board-pharmacy/board-pharmacy.component';

import { Vital1Component } from './reporte/vital1/vital1.component';

// { path: 'register', component: RegisterComponent },
// 


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'mod', component: BoardGovComponent },
  { path: 'pharmacy', component: BoardPharmacyComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'dashboard/:userId', component: Vital1Component},
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
