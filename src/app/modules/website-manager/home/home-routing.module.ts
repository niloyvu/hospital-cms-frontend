import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { AuthGuard } from 'src/app/guards/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { WhoWeAreComponent } from './who-we-are/who-we-are.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { TeamSectionComponent } from './team-section/team-section.component';
import { BlogSectionComponent } from './blog-section/blog-section.component';
import { WhyChooseUsComponent } from './why-choose-us/why-choose-us.component';
import { HeroFormTextComponent } from './hero-form-text/hero-form-text.component';
import { FeatureCardsComponent } from './feature-cards/feature-cards.component';
import { FooterSectionComponent } from './footer-section/footer-section.component';
import { NavbarSectionComponent } from './navbar-section/navbar-section.component';
import { ServiceSectionComponent } from './service-section/service-section.component';
import { CounterSectionComponent } from './counter-section/counter-section.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { NewsLetterSectionComponent } from './news-letter-section/news-letter-section.component';
import { TestimonialSectionComponent } from './testimonial-section/testimonial-section.component';
import { AppointmentSectionComponent } from './appointment-section/appointment-section.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'navbar-section', pathMatch: 'full' },
      { path: 'home', component: NavbarSectionComponent },
      { path: 'navigation-menu', component: NavigationMenuComponent, canActivate: [AuthGuard] },
      { path: 'navbar-section', component: NavbarSectionComponent, canActivate: [AuthGuard] },
      { path: 'hero-section', component: HeroSectionComponent, canActivate: [AuthGuard] },
      { path: 'hero-form-text', component: HeroFormTextComponent, canActivate: [AuthGuard] },
      { path: 'feature-cards', component: FeatureCardsComponent, canActivate: [AuthGuard] },
      { path: 'who-we-are', component: WhoWeAreComponent, canActivate: [AuthGuard] },
      { path: 'service-section', component: ServiceSectionComponent, canActivate: [AuthGuard] },
      { path: 'why-choose-us', component: WhyChooseUsComponent, canActivate: [AuthGuard] },
      { path: 'appointment-section', component: AppointmentSectionComponent, canActivate: [AuthGuard] },
      { path: 'counter-section', component: CounterSectionComponent, canActivate: [AuthGuard] },
      { path: 'team-section', component: TeamSectionComponent, canActivate: [AuthGuard] },
      { path: 'testimonial-section', component: TestimonialSectionComponent, canActivate: [AuthGuard] },
      { path: 'blog-section', component: BlogSectionComponent, canActivate: [AuthGuard] },
      { path: 'newsletter-section', component: NewsLetterSectionComponent, canActivate: [AuthGuard] },
      { path: 'footer-section', component: FooterSectionComponent, canActivate: [AuthGuard] },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
