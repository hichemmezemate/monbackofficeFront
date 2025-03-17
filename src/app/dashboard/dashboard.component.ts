import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService } from '../services/dashboard.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,MatSelectModule,MatOptionModule,NavbarComponent, MatCardModule, MatButtonModule, MatTabsModule, MatTableModule, MatFormFieldModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef;

  public chart: any;

  constructor(private dashService: DashboardService) {}

  private access_token = localStorage.getItem("access_token")

  data: any

  resumeData: any
  resumeData2: any


  canSelect = false


  displayedColumns: string[] = ["Date", "Produit", "Type", "Quantity", "Price","Total"]

  years = [
    { value: 0, label: "Toutes les années" },
    { value: 2025, label: "2025" },
    { value: 2024, label: "2024" },
    { value: 2023, label: "2023" },
    { value: 2022, label: "2022" },
    { value: 2021, label: "2021" },
  ];

  selectedYear = 0

  months = [
    { value: 0, label: "Tous les mois" },
    { value: 1, label: "Janvier" },
    { value: 2, label: "Février" },
    { value: 3, label: "Mars" },
    { value: 4, label: "Avril" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juin" },
    { value: 7, label: "Juillet" },
    { value: 8, label: "Août" },
    { value: 9, label: "Septembre" },
    { value: 10, label: "Octobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Décembre" }
  ];

  selectedMonth = 0

  onMonthChange(month: string): void {
    console.log('Mois sélectionné :', month);
  }

  onYearChange(year: string): void {
    if (this.selectedYear != 0) {
      this.canSelect = true
    }
    console.log('month : ', this.selectedMonth)
    if (this.access_token) {
      this.dashService.getResume(this.access_token, this.selectedYear, this.selectedMonth).subscribe(
        response => {
          console.log("Year : "+this.selectedYear + " month : " + this.selectedMonth)
          // this.resumeData = response[this.selectedYear]
          const theKey = Object.keys(response)[0];
          this.resumeData = response[theKey]
        },
        error => {
          console.error('Fetching failed:', error);
        }
      )
      if (this.selectedYear != 0) {
        this.dashService.getResume2(this.access_token, this.selectedYear, ).subscribe(
          response => {
            console.log("RESPONSE HERE : ",response)
            const theKey = Object.keys(response)[0];
            this.resumeData2 = response
            this.updateChart();
          },
          error => {
            console.error('Fetching failed:', error);
          }
        )
      }
    }
  }

  ngOnInit() {
    if (this.access_token) {
      this.dashService.getResume(this.access_token, this.selectedYear, this.selectedMonth).subscribe(
        response => {
          const theKey = Object.keys(response)[0];
          this.resumeData = response[theKey]
        },
        error => {
          console.error('Fetching failed:', error);
        }
      )
      this.dashService.getTransactionList(this.access_token).subscribe(
        response => {
          this.data = response
        },
        error => {
          console.error('Fetching failed:', error);
        }
      )
    }
  }

  ngAfterViewInit(): void {
    this.updateChart();
  }

  updateChart(): void {
    const labels: string[] = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
  
    // Prepare empty data arrays for each dataset
    const chiffreAffaireData: number[] = new Array(12).fill(0);
    const depensesData: number[] = new Array(12).fill(0);
    const pertesData: number[] = new Array(12).fill(0);
    const argentNetData: number[] = new Array(12).fill(0);
  
    // Fill datasets from resumeData2
    if (this.resumeData2) {
      for (const [key, value] of Object.entries(this.resumeData2)) {
        const monthData = value as {
          chiffre_affaire: number;
          depenses: number;
          pertes: number;
          argent_net: number;
        };
  
        const [year, month] = key.split('-');
        const monthIndex = parseInt(month, 10) - 1;
  
        chiffreAffaireData[monthIndex] = monthData.chiffre_affaire || 0;
        depensesData[monthIndex] = monthData.depenses || 0;
        pertesData[monthIndex] = monthData.pertes || 0;
        argentNetData[monthIndex] = monthData.argent_net || 0;
      }
    }
  
    // Destroy old chart if exists
    if (this.chart) {
      this.chart.destroy();
    }
  
    // Create new chart
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: "Chiffre d'affaire",
            data: chiffreAffaireData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Dépenses',
            data: depensesData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Pertes',
            data: pertesData,
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
          },
          {
            label: 'Argent net',
            data: argentNetData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: false
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
}
