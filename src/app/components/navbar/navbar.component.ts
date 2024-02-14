// import * as $ from 'jquery';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../shared/auth/auth.service';
import { Component, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  showProgressBar: Boolean = false;
  rootUrl = this.common.rootUrl + 'uploads/';
  userdata!: any;
  profiledata!: any;
  userImageFile!: any;
  erroeMsg!: any;

  @Output() handleSidenav = new EventEmitter<boolean>();

  constructor(
    location: Location,
    private router: Router,
    public auth: AuthService,
    private element: ElementRef,
    public common: CommonService,
    public translate: TranslateService,
    public _languageService: LanguageService
  ) {

    this.location = location;
    this.sidebarVisible = false;
    common.onBufferEvent.subscribe(
      (showProgressBar) => {
        this.showProgressBar = showProgressBar;
      });

  }

  ngOnInit(): void {
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


    // const new_color = localStorage.getItem('data-color');
    // if (new_color) {
    //   document.querySelector('.navbare-color').setAttribute('data-color', new_color);
    // } else {
    //   document.querySelector('.navbare-color').setAttribute('data-color', 'azure');
    // }
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
    const $toggle = document.getElementsByClassName('navbar-toggler')[0];
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName('body')[0];

    // if (this.mobile_menu_visible == 1) {
    //   body.classList.remove('nav-open');
    //   if ($layer) {
    //     $layer.remove();
    //   }
    //   setTimeout(function () {
    //     $toggle.classList.remove('toggled');
    //   }, 400);

    //   this.mobile_menu_visible = 0;
    // } else {
    //   setTimeout(function () {
    //     $toggle.classList.add('toggled');
    //   }, 430);

    //   var $layer = document.createElement('div');
    //   $layer.setAttribute('class', 'close-layer');


    //   if (body.querySelectorAll('.main-panel')) {
    //     document.getElementsByClassName('main-panel')[0].appendChild($layer);
    //   } else if (body.classList.contains('off-canvas-sidebar')) {
    //     document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
    //   }

    //   setTimeout(function () {
    //     $layer.classList.add('visible');
    //   }, 100);

    //   $layer.onclick = function () {
    //     body.classList.remove('nav-open');
    //     this.mobile_menu_visible = 0;
    //     $layer.classList.remove('visible');
    //     setTimeout(function () {
    //       $layer.remove();
    //       $toggle.classList.remove('toggled');
    //     }, 400);
    //   }.bind(this);

    //   body.classList.add('nav-open');
    //   this.mobile_menu_visible = 1;

    // }
  };


  onClickLogout() {
    this.common.bearerToken = '';
    this.common.username = '';
    this.auth.logOut();
  }
}
