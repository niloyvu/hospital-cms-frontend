import { NgModule } from '@angular/core';
import { BlogComponent } from './blog.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogRoutingModule } from './blog-routing.module';
import { SharedModule } from './../../../shared/shared.module';
import { BlogHeaderComponent } from './blog-header/blog-header.component';
import { BlogCategoryComponent } from './blog-category/blog-category.component';
import { CreateUpdateBlogComponent } from './blogs/create-update-blog/create-update-blog.component';
import { BlogCategoryModalComponent } from './blog-category/blog-category-modal/blog-category-modal.component';


@NgModule({
  declarations: [
    BlogComponent,
    BlogsComponent,
    BlogHeaderComponent,
    BlogCategoryComponent,
    CreateUpdateBlogComponent,
    BlogCategoryModalComponent,
  ],
  imports: [
    SharedModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
