import {AfterViewInit, Component, OnInit, TemplateRef} from '@angular/core';
import {Product} from "../../../shared/models/product.model";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {ProductService} from "../../../shared/services/product.service";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material";
import {User} from "../../../shared/models/user.model";
import {UserService} from "../../../shared/services/user.service";
import {ReportStatisticsModel} from "../../../shared/models/report-statistics.model";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'name', 'image', 'description', 'lastUpdate', 'reporter', 'creationDate', 'update', 'remove'];
  dataSource: MatTableDataSource<Product>;


  public newProduct: Product;
  public productToDelete: Product;
  public productsArray: Product[] = [];
  public alerts: {
    products: {
      loading: boolean,
      deleting: boolean,
    },
    addProduct: {
      loading: boolean,
    }
  };
  public users: Map<number, User>;
  public selectedUser: User;

  modalRef: BsModalRef;

  constructor(public productService: ProductService, public router: Router, private titleService: Title, private modalService: BsModalService, public snackBar: MatSnackBar, public userService: UserService) {
  }

  ngOnInit() {
    this.titleService.setTitle('ABM Categorias | Stingy');
    this.dataSource = new MatTableDataSource<Product>(this.productsArray);
    this.newProduct = Product.empty();
    this.users = new Map<number, User>();
    this.alerts = {
      products: {
        loading: true,
        deleting: false,
      },
      addProduct: {
        loading: false,
      },
    };
  }

  ngAfterViewInit(): void {
    this.requestProducts();
  }

  requestProducts() {
    this.productService.products.then(res => {
      this.productsArray = res.map(p => {
        this.requestUser(p.userId);
        return Product.from(p)
      });
      this.dataSource.data = this.productsArray;
      this.alerts.products.loading = false;
    })
      .catch(err => {
        this.snackBar.open('Hubo un error al obtener los productos, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
        this.alerts.products.loading = false;
      })
  }

  getUserName(id: number): string {
    return this.users.has(id) ? this.users.get(id).name : 'None';
  }

  private requestUser(userId: number) {
    if (!this.users.has(userId)) {
      this.userService.getUserById(userId)
        .then(user => {
          this.userService.getUserReportStatistics(user.id)
            .then((statistic: ReportStatisticsModel) => {
              user.acceptedReportsPercentage = Math.floor((statistic.solved / statistic.total) * 100);
              this.users.set(user.id, user);
            })
        }).catch(err => {
        this.snackBar.open('Hubo un error al obtener los datos, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      })
    }
  };

  validateProductA() {
    this.alerts.addProduct.loading = true;
    this.productService.validateProduct(this.newProduct.id).then(res => {
      this.newProduct.isValidated = true;
      this.alerts.addProduct.loading = false;
      this.newProduct = Product.empty();
      this.modalRef.hide();
      this.snackBar.open('El producto fue validado correctamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    }).catch(() => {
      this.alerts.addProduct.loading = false;
      this.snackBar.open('Hubo un error al validar el producto, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    })
  }

  deleteProduct() {
    this.alerts.products.deleting = true;
    this.productService.deleteProduct(this.productToDelete.id)
      .then(res => {
        this.productsArray = this.productsArray.filter(p => p.id !== this.productToDelete.id);
        //TODO mostrar mensajes de error/success/ y loader
        this.dataSource.data = this.productsArray;
        this.alerts.products.deleting = false;
        this.modalRef.hide();
        this.snackBar.open('El producto fue eliminado correctamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      })
      .catch(() => {
        this.alerts.products.deleting = false;
        this.snackBar.open('Hubo un error al eliminar el producto, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      })
  }

  openProductModal(template: TemplateRef<any>, product?) {
    if (product) this.newProduct = product;
    this.modalRef = this.modalService.show(template);
  }

  openProductDeleteModal(template: TemplateRef<any>, product,) {
    this.productToDelete = product;
    this.modalRef = this.modalService.show(template);
  }

  resetDeleteModal() {
    this.productToDelete = undefined;
  }

  resetUserModal() {
    this.modalRef.hide();
    this.selectedUser = undefined;
  }

  openRequesterModal(template: TemplateRef<any>, modalReference: string,
                     requester: User, index?: number) {

    if (requester) {
      this.selectedUser = requester;
    }
    this.modalRef = this.modalService.show(template);
  }

}
