import { Component, OnInit } from '@angular/core';
import { pageType } from 'src/app/shared/enum/page-type';

@Component({
  selector: 'app-shop-header',
  templateUrl: './shop-header.component.html',
  styleUrls: ['./shop-header.component.scss']
})
export class ShopHeaderComponent implements OnInit {

  pageType = pageType;
  constructor() { }

  ngOnInit(): void {
  }

}
