import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductsService } from '../services/products.service';
import {MatTableModule} from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { NewTableComponent } from '../new-table/new-table.component';

export interface PeriodicElement {
  id: number;
  name: string;
}

@Component({
  selector: 'app-interface',
  imports: [NewTableComponent,MatTabsModule ,NavbarComponent, MatTableModule, MatCardModule, CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './interface.component.html',
  styleUrl: './interface.component.css'
})
export class InterfaceComponent {

  private access_token = localStorage.getItem("access_token")

  public products = []

  public poissons = []

  public crustaces = []

  public fruitsdemer = []

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    if (this.access_token) {
      this.productsService.getProducts(this.access_token).subscribe(
        response => {
          this.products = response
        },
        error => {
          console.error('Fetching failed:', error);
        }
      )
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    switch (event.index) {
      case 1:
        this.getPoissons();
        break;
      case 2:
        this.getCrustaces();
        break;
      case 3:
        this.getFruitsDeMer();
        break;
      default:
        break;
    }
  }

  getPoissons() {
    if (this.access_token) {
      this.productsService.getPoissons(this.access_token).subscribe(
        response => {
          this.poissons = response
        },
        error => {
          console.error('Fetching failed:', error);
        }
      )
    }
  }


  getCrustaces() {
    if (this.access_token) {
      this.productsService.getCrustaces(this.access_token).subscribe(
        response => {
          this.crustaces = response
        },
        error => {
          console.error('Fetching failed:', error);
        }
      )
    }
  }


  getFruitsDeMer() {
    if (this.access_token) {
      this.productsService.getFruitsDeMer(this.access_token).subscribe(
        response => {
          this.fruitsdemer = response
        },
        error => {
          console.error('Fetching failed:', error);
        }
      )
    }
  }

}
