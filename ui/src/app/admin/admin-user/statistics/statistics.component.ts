import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ProductService} from "../../../shared/services/product.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DateModel} from "../../../shared/models/date-model";
import {Product} from "../../../shared/models/product.model";
import {Chart} from 'chart.js'

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {

  public alerts = {
    products: {
      loading: true,
    },
    statistics: {
      loading: false,
    }
  };
  public products: Product[];
  public selectedProduct: Product;

  @ViewChild('canvas')
  private _canvas: ElementRef;
  private _chart: Chart;
  labels: string[] = [];
  label: string = "Seleccione un Producto";
  data: any[] = [];

  dateFrom: Date = new Date(2010, 10, 20);
  dateTo: Date = new Date();

  constructor(private titleService: Title,
              public productService: ProductService,
              public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.titleService.setTitle('ABM Estadisticas | Stingy');
    this.getProducts();
    this.createChart('FECHA', 'PRECIO');
  }

  getProducts() {
    this.productService.products
      .then(res => {
        this.products = res;
        this.alerts.products.loading = false;
      }).catch(() => {
        this.snackBar.open('Hubo un error al obtener los productos, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snack-bar-error'],
        });
        this.alerts.products.loading = false;
    });
  }

  getStatistics(): void {
    if (this.selectedProduct === undefined || this.dateFrom === undefined || this.dateTo === undefined) {
      this.updateChart('Seleccione un Producto', [], []);
      return;
    }
    this.alerts.statistics.loading = true;
    const from = dateParse(this.dateFrom);
    const to = dateParse(this.dateTo);
    this.productService.getProductStatistics(this.selectedProduct.id, from, to)
      .then(res => {
        console.log('STATICS', res);
        const productName: string = this.selectedProduct.name;
        const labels = res.map(sp => DateModel.from(sp.date).toStringDate());
        const productData = res.map(sp => sp.price);
        this.updateChart(productName, labels, productData);
        this.alerts.statistics.loading = false;
      }).catch(err => {
      this.snackBar.open('Hubo un error al obtener los datos, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: ['snack-bar-error'],
      });
      this.alerts.statistics.loading = false;
    })
  }

  private createChart(xTitle: string, yTitle: string) {
    this._chart = new Chart(this._canvas.nativeElement.getContext('2d'), {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            label: this.label,
            fill: false,
            backgroundColor:
              'rgb(88,190,224)',
            borderColor:
              'rgb(88,190,224)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        legend: {
          display: true,
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: xTitle,
                fontSize: 16,
              },
              ticks: {
                suggestedMin: 0,
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: yTitle,
                fontSize: 16,
                stepSize: 40,
              },
              ticks: {
                min: 0
              }
            },
          ],
        },
      },
    });
  }

  private updateChart(productName: string, labels: string[], data: any[]) {
    if (!this._chart) return;

    this._chart.config.data.labels = labels;
    this._chart.config.data.datasets[0].data = data;
    this._chart.config.data.datasets[0].label = productName;

    this._chart.update();
  }

  setDateTo(event: any): void {
    if (event)
      this.dateTo = new Date(event);
  }

  setDateFrom(event: any): void {
    if (event)
      this.dateFrom = new Date(event);
  }
}

const dateParse = function (date: Date): DateModel {
  return DateModel.dateModelFromDateWithTime(date);
};




