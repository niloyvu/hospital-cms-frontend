import { filter } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CommonService } from './services/common.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  breadcrumbs!: any;
  currentUrl!: any;
  ActiveRouteStr: any;

  constructor(
    private router: Router,
    public common: CommonService,
    private activatedRoute: ActivatedRoute,
  ) { }


  ngOnInit(): void {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });

    this.breadcrumbs = [];
    this.ActiveRouteStr = this.activatedRoute.snapshot.url;

    //this.breadcrumbs = this.ActiveRouteStr.slice(1).split('/');

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.ActiveRouteStr = this.activatedRoute.snapshot.url
      // this.breadcrumbs = this.ActiveRouteStr.slice(1).split('/');
    });
  }

  getBredCrumbsValue(breadcrumbs: any) {
    let bread = breadcrumbs.split('-')
    let string = ''
    bread.forEach((item: any) => {
      string += item + ' '
    })
    return string;
  }

}