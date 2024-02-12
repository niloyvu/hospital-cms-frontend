import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { ServicesComponent } from './services/services.component';
import { DentistsComponent } from './dentists/dentists.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { WebsiteManagerRoutingModule } from './website-manager-routing.module';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { ServiceModalComponent } from './services/service-modal/service-modal.component';
import { DentistModalComponent } from './dentists/dentist-modal/dentist-modal.component';
import { ServiceDetailsComponent } from './services/service-details/service-details.component';
import { DentistDetailsComponent } from './dentists/dentist-details/dentist-details.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { TestimonialModalComponent } from './testimonial/testimonial-modal/testimonial-modal.component';
import { WorkingProcessComponent } from './dentists/working-process/working-process.component';


@NgModule({
  declarations: [
    AboutUsComponent,
    DentistsComponent,
    ServicesComponent,
    ContactUsComponent,
    ServiceModalComponent,
    DentistModalComponent,
    ServiceDetailsComponent,
    DentistDetailsComponent,
    BookAppointmentComponent,
    TestimonialComponent,
    TestimonialModalComponent,
    WorkingProcessComponent
  ],
  imports: [
    SharedModule,
    WebsiteManagerRoutingModule,
  ]
})

export class WebsiteManagerModule { }
