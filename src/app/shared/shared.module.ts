import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderStatusColorPipe } from './pipes/order-status-color.pipe';
import { AppointmentStatusPipe } from './pipes/appointment-status.pipe';
import { AppointmentStatusColorPipe } from './pipes/appointment-status-color.pipe';
import { PageHeaderComponent } from './components/service-page-header/page-header.component';

@NgModule({
  declarations: [
    PageHeaderComponent,
    OrderStatusColorPipe,
    AppointmentStatusPipe,
    AppointmentStatusColorPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FormsModule,
    EditorModule,
    MaterialModule,
    NgZorroAntdModule,
    NgZorroAntdModule, 
    ReactiveFormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
  ], 

  exports: [
    FormsModule,
    FormsModule,
    CommonModule,
    EditorModule,
    MaterialModule,
    NgZorroAntdModule,
    NgZorroAntdModule, 
    PageHeaderComponent,
    ReactiveFormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    OrderStatusColorPipe,
    AppointmentStatusPipe,
    AppointmentStatusColorPipe
  ]
})
export class SharedModule { }
