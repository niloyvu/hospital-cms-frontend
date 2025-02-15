import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from '../../shared/auth/auth.service';
import { CommonService } from '../../services/common.service';
import { LoaderService } from 'src/app/services/loader.service';
import { LanguageService } from 'src/app/services/language.service';
import { Component, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  modeType!: any;
  authenticatedUser: any;
  private toggleButton: any;
  mobile_menu_visible: any = 0;
  showProgressBar: Boolean = false;
  private sidebarVisible: boolean = false;

  @Output() handleSidenav = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    public auth: AuthService,
    private element: ElementRef,
    public loader: LoaderService,
    public common: CommonService,
    private dataService: DataService,
    public translate: TranslateService,
    public _languageService: LanguageService,
  ) {}
  
  ngOnInit(): void {
    this.loader.requestType$.subscribe((type: string) => {
      this.modeType = type === 'GET'? 'query' : 'indeterminate';
    });

    this.getAuthenticatedUser();
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      var $layer: any = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
  }

  handleSideBar() {
    this.handleSidenav.emit(true);
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);

    body.classList.add('nav-open');

    this.sidebarVisible = true;
  };
  sidebarClose() {
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    body.classList.remove('nav-open');
  };

  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  };

  getAuthenticatedUser() {
    this.dataService.getJson('system/user/auth-user-profile', '')
      .subscribe({
        next: ({ data, code }) => {
          if (code == 200) {
            this.authenticatedUser = data;
          } else {
            this.authenticatedUser = [];
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  onClickLogout() {
    this.common.bearerToken = '';
    this.common.username = '';
    this.auth.logOut();
  }
}
