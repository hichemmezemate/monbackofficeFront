import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-new-table',
  imports: [MatTableModule, MatFormFieldModule, MatIconModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './new-table.component.html',
  styleUrl: './new-table.component.css'
})
export class NewTableComponent {
  @Input() products: any[] = [];
  dataSource = this.products
  displayedColumns: string[] = ['Nom', "Prix d'achat", "Prix de vente", 'Prix de vente en promo', 'Quantité', 'Commentaires', 'Actions']; 
  editingRowId: number | null = null;
  
  editedRows: any[] = []
  
  quantity: any
  
  access_token = localStorage.getItem("access_token")
  
  constructor(private productsService: ProductsService) {}

  initialQuantity: any
  initialPrice: any
  initialSale: any
  initialSellPrice: any


  startEditPrice(element: any) {
    console.log("START")
  }

  stopEditPrice(element: any) {
    console.log("STOP")
  }

  
  startEdit(element: any) {
    this.editingRowId = element.id;
    this.initialQuantity = element.quantityInStock
    this.initialPrice = element.price
    this.initialSale = element.discount
    this.initialSellPrice = element.sellprice
  }
  
  stopEdit(element: any) {
    this.editingRowId = null;

    const prod = { id: element.id, newQuantity: element.quantityInStock, newPrice: element.price, newSellPrice: element.sellprice, newDiscount: element.discount };
  
    const existingIndex = this.editedRows.findIndex(p => p.id === prod.id);
  
    if (existingIndex === -1) {
      this.editedRows.push(prod);
    } else {
      this.editedRows[existingIndex].newQuantity = prod.newQuantity;
    }
  }

  saveChange() {
    if (this.editedRows.length > 0 && this.access_token) {
        this.productsService.editQuantities(this.access_token, this.editedRows).subscribe(
          response => {
            return "Succes"
          },
          error => {
            console.error('Fetching failed:', error);
          }
        )
      }
    }

  resetRow(element: any) {
    element.quantityInStock = this.initialQuantity
    element.price = this.initialPrice
    element.discount = this.initialSale
  }

  resetAll() {
    window.location.reload()
  }
}
