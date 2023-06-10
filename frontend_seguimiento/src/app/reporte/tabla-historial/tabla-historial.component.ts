import { Component, OnInit } from '@angular/core'; 
import { Medicion } from 'src/app/interfaces/medicion';
import { DashboardService } from 'src/app/_services/data-client.service';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-tabla-historial',
  templateUrl: './tabla-historial.component.html',
  styleUrls: ['./tabla-historial.component.css']
})
export class TablaHistorialComponent implements OnInit{
  datos: any = [];
  id_cliente!: number;
  
  constructor(private dashboardService: DashboardService, private storageService: StorageService) { }

  ngOnInit(): void {
    this.id_cliente = this.storageService.getUser().id;
    this.dashboardService.getDashboard(this.id_cliente).subscribe(res => {
      this.datos = res.map((item: any) =>{
        const fecha = new Date(item.date_time);
        const fechaFormateada = fecha.toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        return { ...item, date_time: fechaFormateada }; 

      });
    });
  }

}
