import { Component, OnInit, ViewChild} from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType, ChartOptions, ChartDataset } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from 'src/app/_services/data-client.service';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})

export class BarChartComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        min: 0,
        max: 130,
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        display: true,
      },
    },
  };

  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Tú', backgroundColor: '#a4cda4'},
      { data: [65, 15.5, 76.45, 27.41, 90, 36.6, 120], label: 'Población', backgroundColor: '#5da337'}
    ],
  };

  constructor(private dashboardService: DashboardService, private storageService: StorageService) {}

  ngOnInit() {
    this.loadData();
  }

  id_cliente!: number;

  private loadData() {
    this.id_cliente = this.storageService.getUser().id;
    this.dashboardService.getChartData(this.id_cliente).subscribe(data => {
      this.barChartData.datasets[0].data = data[0];
      this.chart?.update();
    });
  }

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }
}

