import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RemoveHyphensPipe } from './pipes/remove-hyphens.pipe';
import { OrderStatusColorPipe } from './pipes/order-status-color.pipe';
import { AppointmentStatusPipe } from './pipes/appointment-status.pipe';
import { AppointmentStatusColorPipe } from './pipes/appointment-status-color.pipe';
import { PageHeaderComponent } from './components/service-page-header/page-header.component';

@NgModule({
  declarations: [
    RemoveHyphensPipe,
    PageHeaderComponent,
    OrderStatusColorPipe,
    AppointmentStatusPipe,
    AppointmentStatusColorPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    EditorModule,
    MaterialModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ], 

  exports: [
    FormsModule,
    CommonModule,
    EditorModule,
    MaterialModule,
    RemoveHyphensPipe,
    NgZorroAntdModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    NgxPaginationModule,
    OrderStatusColorPipe,
    AppointmentStatusPipe,
    AppointmentStatusColorPipe
  ]
})
export class SharedModule { }
