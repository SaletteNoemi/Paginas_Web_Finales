import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardPharmacyComponent } from './board-pharmacy/board-pharmacy.component';
import { BoardGovComponent } from './board-gov/board-gov.component';
import { BoardUserComponent } from './board-user/board-user.component';

import { httpInterceptorProviders } from './_helpers/http.interceptor';

import { AngularMaterialsModule } from './angular-materials/angular-materials';
import { NavbarComponent } from './navbar/navbar.component';
import { Vital1Component } from './reporte/vital1/vital1.component';
import { BarChartComponent } from './reporte/bar-chart/bar-chart.component';
import { TablaHistorialComponent } from './reporte/tabla-historial/tabla-historial.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgChartsModule } from 'ng2-charts'



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardPharmacyComponent,
    BoardGovComponent,
    BoardUserComponent,
    NavbarComponent,
    Vital1Component,
    BarChartComponent,
    TablaHistorialComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularMaterialsModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    NgChartsModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
