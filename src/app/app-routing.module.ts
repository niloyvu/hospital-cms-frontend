import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'system',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/system-admin/system-admin.module').then(
        (m) => m.SystemAdminModule
      ),
  },

  {
    path: 'website-cms',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/website-manager/website-manager.module').then(
        (m) => m.WebsiteManagerModule
      ),
  },
  {
    path: 'website',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/website-frontend/website-frontend.module').then(
        (m) => m.WebsiteFrontendModule
      ),
  },
  {
    path: 'invoice-management',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/invoice-management/invoice-management.module').then(
        (m) => m.InvoiceManagementModule
      ),
  },
  {
    path: 'accounts-management',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/accounts-management/accounts-management.module').then(
        (m) => m.AccountsManagementModule
      ),
  },

  {
    path: '**', component: NotFoundComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
