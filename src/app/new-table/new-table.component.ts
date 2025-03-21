import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ProductsService } from '../services/products.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-table',
  imports: [MatTableModule, MatFormFieldModule, MatIconModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './new-table.component.html',
  styleUrl: './new-table.component.css'
})
export class NewTableComponent {
  @Input() products: any[] = [];
  dataSource = this.products
  displayedColumns: string[] = ['Nom', "Prix d'achat", "Prix de vente", 'Prix de vente en promo', 'Quantité', 'QuantitéEdit', 'Commentaires']; 
  editingRowId: number | null = null;

  
  editedRows: any[] = []
  
  quantity: any
  
  access_token = localStorage.getItem("access_token")
  
  constructor(private productsService: ProductsService, private snackBar: MatSnackBar) {}

  initialQuantity: any
  initialPrice: any
  initialSale: any
  initialSellPrice: any

  transaction_type: string = ''

  quantityToEdit: number = 0

  startEdit(element: any) {
    this.editingRowId = element.id;
    this.initialQuantity = element.quantityInStock
    this.initialPrice = element.price
    this.initialSale = element.discount
    this.initialSellPrice = element.sellprice
  }
  
  stopEdit(element: any) {
    if (element.type == "VENTE" && element.quantityInStock - element.quantityToEdit < 0) {
      this.showMessage('Quantité vendue est superieure a la quantité disponible')
    } else {
      this.editingRowId = null;

      const prod = { id: element.id, newQuantity: element.quantityInStock, newPrice: element.price, newSellPrice: element.sellprice, newDiscount: element.discount, type: element.type, quantityEdit: element.quantityToEdit};
    
      const existingIndex = this.editedRows.findIndex(p => p.id === prod.id);
    
      if (existingIndex === -1) {
        this.editedRows.push(prod);
      } else {
        this.editedRows[existingIndex].newPrice = prod.newPrice;
        this.editedRows[existingIndex].newSellPrice = prod.newSellPrice;
        this.editedRows[existingIndex].newDiscount = prod.newDiscount;
        this.editedRows[existingIndex].transactionType = prod.type; 
        this.editedRows[existingIndex].editedQuantity = prod.quantityEdit
      }
    }
  }

  showMessage(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['custom-snackbar']
    });
  }

  saveChange() {
    if (this.editedRows.length > 0 && this.access_token) {
        this.productsService.editQuantities(this.access_token, this.editedRows).subscribe(
          response => {
            this.showMessage('Modification des champs réussie')
            return "Succes"
          },
          error => {
            this.showMessage("Erreur")
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
