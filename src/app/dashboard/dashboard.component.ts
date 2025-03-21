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
import { ArcElement, BarController, BarElement, CategoryScale, Chart, DoughnutController, Legend, LinearScale, Title, Tooltip } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController, DoughnutController, ArcElement);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,MatSelectModule,MatOptionModule,NavbarComponent, MatCardModule, MatButtonModule, MatTabsModule, MatTableModule, MatFormFieldModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef;
  @ViewChild('chartCanvas2', { static: false }) chartCanvas2!: ElementRef;
  @ViewChild('pieCanvas', { static: false }) pieCanvas!: ElementRef;



  public chart: any;
  public chart2: any;
  public pieChart: any

  messageContent: string = '';
  messageStyle: { backgroundColor: string } = { backgroundColor: '' };

  constructor(private dashService: DashboardService) {this.updateMessageAndStyle();}

  updateMessageAndStyle(): void {
    if (this.argentNet < 0) {
      this.messageContent = 'Attention! La marge est négative.';
      this.messageStyle.backgroundColor = 'rgba(255, 99, 132, 0.6)';  
    } else if (this.argentNet > 0) {
      this.messageContent = 'Félicitations! La marge est positive.';
      this.messageStyle.backgroundColor = 'rgba(75, 192, 75, 0.6)';  
    }
  }
  private access_token = localStorage.getItem("access_token")

  data: any

  resumeData: any
  resumeData2: any
  pieChartData: any
  argentNet: number = 0

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

  mostSold: any

  typeTransaction = [
    {value: "AJOUT", label: "Depenses"},
    {value: "PERTE", label: "Pertes"},
    {value: "VENTE", label: "Ventes"},
  ]

  selectedType = this.typeTransaction[0].value

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

  getTransactionsCount() {
    if (this.access_token) {
      this.dashService.getTransactionsCount(this.access_token, this.selectedYear, this.selectedMonth, this.selectedType).subscribe(
        response => {
          this.pieChartData = response[this.selectedYear][this.selectedMonth][this.selectedType]
          this.updatePieChart()
          this.mostSold = this.getTopItem(this.pieChartData);
        },
        error => {
          console.error('Fetching failed:', error);
        }
      )
    }
  }

  getResume() {
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
      if (this.selectedYear != 0) {
        this.dashService.getResume2(this.access_token, this.selectedYear, ).subscribe(
          response => {
            this.resumeData2 = response
            this.updateChart();
            this.updateChart2()
            this.updatePieChart()
          },
          error => {
            console.error('Fetching failed:', error);
          }
        )
      }
    }
  }

  getTopItem = (obj: Record<string, number>): { key: string, count: number } | null => {
    const entries = Object.entries(obj) as [string, number][];
    const maxCount = Math.max(...entries.map(([, count]) => count));
    
    const topEntry = entries.find(([, count]) => count === maxCount);

    return topEntry ? { key: topEntry[0], count: topEntry[1] } : null;
  };

  onTypeChange(type: string): void {
    this.getTransactionsCount()
  }

  onYearChange(year: string): void {
    if (this.selectedYear != 0) {
      this.canSelect = true
    } else {
      this.canSelect = false
    }
    this.getResume()
    this.getTransactionsCount()
    this.updateMessageAndStyle()
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
    this.updateChart2();
    this.updatePieChart()
  }

  updateChart(): void {
    const labels: string[] = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
    const chiffreAffaireData: number[] = new Array(12).fill(0);
    const depensesData: number[] = new Array(12).fill(0);
    if (this.resumeData2) {
      for (const [key, value] of Object.entries(this.resumeData2)) {
        const monthData = value as {
          chiffre_affaire: number;
          depenses: number;
        };
        const [year, month] = key.split('-');
        const monthIndex = parseInt(month, 10) - 1;
        chiffreAffaireData[monthIndex] = monthData.chiffre_affaire || 0;
        depensesData[monthIndex] = monthData.depenses || 0;
      }
    }
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: "Chiffre d'affaire",
            data: chiffreAffaireData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Dépenses',
            data: depensesData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
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

  updateChart2(): void {
    const labels: string[] = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
    const argentNetData: number[] = new Array(12).fill(0);
    const backgroundColors: string[] = new Array(12).fill('');
    const borderColors: string[] = new Array(12).fill('');
  
    if (this.resumeData2) {
      for (const [key, value] of Object.entries(this.resumeData2)) {
        const monthData = value as {
          argent_net: number;
        };
        const [year, month] = key.split('-');
        const monthIndex = parseInt(month, 10) - 1;
        const argent = monthData.argent_net || 0;
        argentNetData[monthIndex] = argent;
        this.argentNet = monthData.argent_net 
  
        if (argent >= 0) {
          backgroundColors[monthIndex] = 'rgba(75, 192, 75, 0.6)'; 
          borderColors[monthIndex] = 'rgb(75, 192, 75)';
        } else {
          backgroundColors[monthIndex] = 'rgba(255, 99, 132, 0.6)';
          borderColors[monthIndex] = 'rgb(255, 99, 132)';
        }
      }
    }
  
    if (this.chart2) {
      this.chart2.destroy();
    }
  
    this.chart2 = new Chart(this.chartCanvas2.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: "Marge",
            data: argentNetData,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          },
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

  updatePieChart(): void {
    const labels: string[] = [];
    const data: number[] = [];
    const backgroundColors: string[] = [];
    const borderColors: string[] = [];
  
    const resumeData: Record<string, number> = this.pieChartData;
  
    if (resumeData) {
      let index = 0;
      for (const [product, count] of Object.entries(resumeData)) {
        labels.push(product);
        data.push(count);
  
        const color = this.generateColor(index);
        backgroundColors.push(`${color}80`);
        borderColors.push(color);
        index++;
      }
    }

    const pieCanvasElement = this.pieCanvas.nativeElement;

    pieCanvasElement.style.width = '60%';  
    pieCanvasElement.style.height = '300px';  
    pieCanvasElement.style.margin = '0 auto'; 

  
    if (this.pieChart) {
      this.pieChart.destroy();
    }
  
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Transactions par produit',
            data: data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
  }
  
  generateColor(index: number): string {
    const colors: string[] = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#E7E9ED', '#9CCC65',
      '#FF7043', '#26C6DA', '#AB47BC', '#EC407A'
    ];
    return colors[index % colors.length];
  }
  

}