import { Component, OnInit } from '@angular/core';
import { pageType } from 'src/app/shared/enum/page-type';

@Component({
  selector: 'app-blog-header',
  templateUrl: './blog-header.component.html',
  styleUrls: ['./blog-header.component.scss']
})
export class BlogHeaderComponent implements OnInit {

  pageType = pageType;
  constructor() { }

  ngOnInit(): void {
  }

}
