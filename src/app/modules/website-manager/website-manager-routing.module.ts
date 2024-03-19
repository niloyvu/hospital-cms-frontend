import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { ServicesComponent } from './services/services.component';
import { DentistsComponent } from './dentists/dentists.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { ServiceDetailsComponent } from './services/service-details/service-details.component';
import { DentistDetailsComponent } from './dentists/dentist-details/dentist-details.component';
import { TestimonialComponent } from './testimonial/testimonial.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },

  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then(
        (m) => m.HomeModule
      ),
  },
  {
    path: 'blogs',
    loadChildren: () =>
      import('./blog/blog.module').then(
        (m) => m.BlogModule
      ),
  },
  {
    path: 'shop',
    loadChildren: () =>
      import('./shop/shop.module').then(
        (m) => m.ShopModule
      ),
  },

  { path: 'about-us', component: AboutUsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'dentists', component: DentistsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'testimonial', component: TestimonialComponent },
  { path: 'appointment', component: BookAppointmentComponent },
  { path: 'service/:name/:id', component: ServiceDetailsComponent },
  { path: 'dentist/:name/:id', component: DentistDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteManagerRoutingModule { }
