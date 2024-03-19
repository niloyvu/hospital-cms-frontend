import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { SharedModule } from './shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { BrowserModule } from '@angular/platform-browser';
import { IconDefinition } from '@ant-design/icons-angular';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { environment } from 'src/environments/environment.development';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OpenServiceImgModal, SnackBarComponentExampleSnack } from './services/common.service';
import {
  MenuOutline,
  HomeOutline,
  UserOutline,
  TagsOutline,
  ToolOutline,
  PhoneOutline,
  DragOutline,
  TeamOutline,
  BellOutline,
  BookOutline,
  ShopOutline,
  MailOutline,
  GlobalOutline,
  SettingOutline,
  ControlOutline,
  MobileOutline,
  MessageOutline,
  PrinterOutline,
  FileDoneOutline,
  MenuFoldOutline,
  ContactsOutline,
  FileTextOutline,
  FilePdfOutline,
  DashboardOutline,
  FieldTimeOutline,
  MenuUnfoldOutline,
  InfoCircleOutline,
  OrderedListOutline,
  ClockCircleOutline,
  SecurityScanOutline,
  UsergroupAddOutline,
  ShoppingCartOutline,
  UnorderedListOutline,
  CustomerServiceOutline,
} from '@ant-design/icons-angular/icons';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.API_URL + './i18n/', '.json');
}

const icons: IconDefinition[] = [
  UserOutline,
  HomeOutline,
  TagsOutline,
  TeamOutline,
  BookOutline,
  MailOutline,
  MenuOutline,
  DragOutline,
  ToolOutline,
  BellOutline,
  ShopOutline,
  PhoneOutline,
  MobileOutline,
  GlobalOutline,
  FilePdfOutline,
  MessageOutline,
  SettingOutline,
  ControlOutline,
  FileDoneOutline,
  MenuFoldOutline,
  PrinterOutline,
  FileTextOutline,
  ContactsOutline,
  DashboardOutline,
  FieldTimeOutline,
  InfoCircleOutline,
  MenuUnfoldOutline,
  ClockCircleOutline,
  OrderedListOutline,
  ShoppingCartOutline,
  SecurityScanOutline,
  UsergroupAddOutline,
  UnorderedListOutline,
  CustomerServiceOutline,
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
