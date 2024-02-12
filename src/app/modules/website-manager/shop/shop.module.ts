
import { NgModule } from '@angular/core';
import { ShopComponent } from './shop.component';
import { ShopRoutingModule } from './shop-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductsComponent } from './products/products.component';
import { ShopHeaderComponent } from './shop-header/shop-header.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { CreateUpdateProductComponent } from './products/create-update-product/create-update-product.component';
import { ProductCategoryModalComponent } from './product-category/product-category-modal/product-category-modal.component';


@NgModule({
  declarations: [
    ShopComponent,
    ProductsComponent,
    ShopHeaderComponent,
    ProductCategoryComponent,
    CreateUpdateProductComponent,
    ProductCategoryModalComponent
  ],
  imports: [
    SharedModule,
    ShopRoutingModule,
  ]
})

export class ShopModule { }
