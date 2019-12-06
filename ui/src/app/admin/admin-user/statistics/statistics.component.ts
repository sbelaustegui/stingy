import {Component, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ProductService} from "../../../shared/services/product.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DateModel} from "../../../shared/models/date-model";
import {ChartDataSets, ChartOptions} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import {Product} from "../../../shared/models/product.model";

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
  public statistics: any[];
  public products: Product[];
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: any[];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[];
  public selectedProduct: Product;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  constructor(private titleService: Title, public productService: ProductService, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.titleService.setTitle('ABM Estadisticas | Stingy');
    this.getProducts();
  }

  getProducts() {
    this.productService.products
      .then(res => {
        this.products = res;
        this.alerts.products.loading = false;
      }).catch(() => {
        this.snackBar.open('Hubo un error al obtener los productos, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
        this.alerts.products.loading = false;
      })
  }

  getStatistics(){
    this.alerts.statistics.loading = true;
    let from = DateModel.dateModelFromDateWithTime(new Date(2010, 10, 20));
    let to = DateModel.dateModelFromDateWithTime(new Date());
    this.productService.getProductStatistics(this.selectedProduct.id, from, to)
      .then(res => {
        this.statistics = res;
        this.barChartData = [{ data: res.map(sp => sp.price), label: this.selectedProduct.name }];
        this.barChartLabels = res.map(sp => DateModel.from(sp.date).toStringDate());
        this.alerts.statistics.loading = false;
      }).catch(err => {
        this.snackBar.open('Hubo un error al obtener los datos, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
        this.alerts.statistics.loading = false;
      })
  }
}
