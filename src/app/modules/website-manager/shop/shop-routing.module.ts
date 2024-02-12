import { NgModule } from '@angular/core';
import { ShopComponent } from './shop.component';
import { AuthGuard } from 'src/app/guards/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ShopHeaderComponent } from './shop-header/shop-header.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { CreateUpdateProductComponent } from './products/create-update-product/create-update-product.component';

const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: ProductsComponent },
      { path: 'create-product', component: CreateUpdateProductComponent },
      { path: 'update-product/:name/:id', component: CreateUpdateProductComponent },
      { path: 'header', component: ShopHeaderComponent, canActivate: [AuthGuard] },
      { path: 'category', component: ProductCategoryComponent, canActivate: [AuthGuard] }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
