import { filter } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  currentUrl!: any;
  breadcrumbs!: any;
  sidebarToggled = false;

  constructor(
    private router: Router,
    public common: CommonService,
  ) { }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.url;
          this.breadcrumbs = this.currentUrl.slice(1).split('/');
        }
      });
  }

  toggleSidebar() {
    this.sidebarToggled = !this.sidebarToggled;
  }
}