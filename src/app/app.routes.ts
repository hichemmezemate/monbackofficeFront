import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InterfaceComponent } from './interface/interface.component';
import { authGuard } from './auth.guard';
import { NotAvailableComponent } from './not-available/not-available.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    {path: "", component: LoginComponent},
    {path: "interface", component: InterfaceComponent, canActivate: [authGuard]},
    {path: "dashboard", component: DashboardComponent, canActivate: [authGuard]},
    {path: '404', component: NotAvailableComponent },
    {path: '**', redirectTo: '/404' }
];