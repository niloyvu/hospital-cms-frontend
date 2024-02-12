
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { NavigationMenuModalComponent } from './navigation-menu-modal/navigation-menu-modal.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {

  menuLinks: any[] = [];
  dialogOpen: boolean = false;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.getCMSmenuLinks();
  }


  getCMSmenuLinks() {

    this.commonService.onBufferEvent.emit(true);

    this.dataService
      .getJson('website-cms/navigation-links', ``)
      .subscribe({
        next: ({ code, data }) => {
          this.commonService
            .onBufferEvent.emit(false);
          if (code == 200) {
            this.menuLinks = data;
          } else {
            this.menuLinks = [];
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  createMenuLink() {
    if (!this.dialogOpen) {
      const dialogRef = this.dialog.open(NavigationMenuModalComponent, {
        width: "700px",
        data: null,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe(result => {
          this.dialogOpen = false;
          if (result) this.getCMSmenuLinks();
        });
    }
  }

  updateMenuLink(link: any) {
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      const dialogRef = this.dialog.open(NavigationMenuModalComponent, {
        width: "700px",
        data: link,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe(result => {
          this.dialogOpen = false;
          if (result) this.getCMSmenuLinks();
        });
    }
  }

}
