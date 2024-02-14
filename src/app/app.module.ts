import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { IconDefinition } from '@ant-design/icons-angular';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OpenServiceImgModal, SnackBarComponentExampleSnack } from './services/common.service';
import {
  MenuOutline,
  UserOutline,
  TagsOutline,
  TeamOutline,
  BookOutline,
  MenuFoldOutline,
  DashboardOutline,
  MenuUnfoldOutline,
} from '@ant-design/icons-angular/icons';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment.development';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.API_URL + './i18n/', '.json');
}

const icons: IconDefinition[] = [
  UserOutline,
  TagsOutline,
  TeamOutline,
  BookOutline,
  MenuOutline,
  MenuFoldOutline,
  DashboardOutline,
  MenuUnfoldOutline
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FooterComponent,
    SidebarComponent,
    NavbarComponent,
    NotFoundComponent,
    OpenServiceImgModal,
    SnackBarComponentExampleSnack,
  ],
  imports: [
    SharedModule,
    EditorModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NzIconModule.forRoot(icons),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
