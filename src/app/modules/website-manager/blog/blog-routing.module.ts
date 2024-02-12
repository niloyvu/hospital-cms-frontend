import { NgModule } from '@angular/core';
import { BlogComponent } from './blog.component';
import { AuthGuard } from 'src/app/guards/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogHeaderComponent } from './blog-header/blog-header.component';
import { BlogCategoryComponent } from './blog-category/blog-category.component';
import { CreateUpdateBlogComponent } from './blogs/create-update-blog/create-update-blog.component';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: BlogsComponent },
      { path: 'create-blog', component: CreateUpdateBlogComponent },
      { path: 'update-blog/:name/:id', component: CreateUpdateBlogComponent },
      { path: 'header', component: BlogHeaderComponent, canActivate: [AuthGuard] },
      { path: 'category', component: BlogCategoryComponent, canActivate: [AuthGuard] }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
