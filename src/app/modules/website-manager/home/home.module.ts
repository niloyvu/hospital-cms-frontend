import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";
import { NgxPaginationModule } from "ngx-pagination";
import { EditorModule } from "@tinymce/tinymce-angular";
import { HomeRoutingModule } from './home-routing.module';
import { MaterialModule } from "src/app/shared/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WhoWeAreComponent } from "./who-we-are/who-we-are.component";
import { NgZorroAntdModule } from "src/app/shared/ng-zorro-antd.module";
import { TeamSectionComponent } from './team-section/team-section.component';
import { HeroSectionComponent } from "./hero-section/hero-section.component";
import { BlogSectionComponent } from './blog-section/blog-section.component';
import { WhyChooseUsComponent } from './why-choose-us/why-choose-us.component';
import { FeatureCardsComponent } from "./feature-cards/feature-cards.component";
import { HeroFormTextComponent } from "./hero-form-text/hero-form-text.component";
import { FooterSectionComponent } from './footer-section/footer-section.component';
import { NavbarSectionComponent } from './navbar-section/navbar-section.component';
import { CounterSectionComponent } from './counter-section/counter-section.component';
import { ServiceSectionComponent } from "./service-section/service-section.component";
import { HomepageSidebarComponent } from "./homepage-sidebar/homepage-sidebar.component";
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { NewsLetterSectionComponent } from './news-letter-section/news-letter-section.component';
import { AppointmentSectionComponent } from './appointment-section/appointment-section.component';
import { TestimonialSectionComponent } from './testimonial-section/testimonial-section.component';
import { NavigationMenuModalComponent } from './navigation-menu/navigation-menu-modal/navigation-menu-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EditorModule,
    MaterialModule,
    NgZorroAntdModule,
    HomeRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ],
  declarations: [
    HomeComponent,
    WhoWeAreComponent,
    HeroSectionComponent,
    HeroFormTextComponent,
    WhyChooseUsComponent,
    FeatureCardsComponent,
    TeamSectionComponent,
    BlogSectionComponent,
    FooterSectionComponent,
    NavbarSectionComponent,
    ServiceSectionComponent,
    CounterSectionComponent,
    HomepageSidebarComponent,
    NavigationMenuComponent,
    NewsLetterSectionComponent,
    TestimonialSectionComponent,
    AppointmentSectionComponent,
    NavigationMenuModalComponent,
  ]
})
export class HomeModule { }
