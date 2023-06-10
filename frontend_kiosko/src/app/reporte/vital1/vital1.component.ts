import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../_services/data-client.service';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-vital1',
  templateUrl: './vital1.component.html',
  styleUrls: ['./vital1.component.css']
})

export class Vital1Component implements OnInit {
  Id_cliente!: number; // Cambia esto por el ID del usuario que deseas mostrar
  userRitmo!: number;
  userFrecuencia!: number;
  userPeso!: number;
  userAltura!: number;
  userBMI!: number;
  userSaturacion!: number;
  userTemperatura!: number;
  userPresion!: number;

  constructor(private dashboardService: DashboardService, private storageService: StorageService) { }

  ngOnInit() {
    this.Id_cliente = this.storageService.getUser().id;
    this.dashboardService.getDashboard(this.Id_cliente).subscribe(user => {
      this.userRitmo = user[0].ritmo_cardiaco;
      this.userFrecuencia = user[0].frecuencia_respiratoria;
      this.userPeso = user[0].peso;
      this.userAltura = user[0].altura;
      this.userBMI = user[0].indice_masa_corporal;
      this.userSaturacion = user[0].saturacion_oxigeno;
      this.userTemperatura = user[0].temperatura;
      this.userPresion = user[0].presion_sanguinea_sistolica;
    });
  }
}
