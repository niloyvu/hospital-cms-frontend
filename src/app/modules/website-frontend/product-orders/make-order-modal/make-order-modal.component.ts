import { Component, Inject, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

export enum orderType {
  Online = 1,
  Offline
}
@Component({
  selector: 'app-make-order-modal',
  templateUrl: './make-order-modal.component.html',
  styleUrls: ['./make-order-modal.component.scss']
})
export class MakeOrderModalComponent implements OnInit {

  products!: any[];
  orderType = orderType;
  makeOrderForm!: FormGroup;
  deliveryCharge: number = 0;
  isDisabled: boolean = false;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MakeOrderModalComponent>
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getActiveProducts();
    this.subscribeToFormChanges();
    if (this.data) {
      this.makeOrderForm.patchValue(this.data);
    }
  }
  
  initializeForm() {
    this.makeOrderForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      phone: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern('^[0-9]+$')]],
      district: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15),]],
      thana: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15),]],
      address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50),]],
      product_id: [null, [Validators.required]],
      product_price: [0, [Validators.required]],
      quantity: [null, [Validators.required]],
      delivery_charge: [0],
      order_type: [orderType.Offline],
      total_amount: [],
      status: [0],
      remarks: [],
    });

    this.makeOrderForm.get('product_id')?.valueChanges.subscribe((product_id) => {
      const product = this.products?.find(p => p.id === product_id);
      this.makeOrderForm.get('product_price')?.setValue(product?.price);
    });

    this.makeOrderForm.get('order_type')?.valueChanges.subscribe((type) => {
      if (type === orderType.Online) {
        const district = this.makeOrderForm.get('district')?.value.toLowerCase();
        this.deliveryCharge = district === 'dhaka' ? 60 : 150;
        this.makeOrderForm.get('delivery_charge')?.setValue(this.deliveryCharge);

        this.makeOrderForm.get('district')?.valueChanges.subscribe((value) => {
          const updatedDistrict = value.toLowerCase();
          this.deliveryCharge = updatedDistrict === 'dhaka' ? 60 : 150;
          this.makeOrderForm.get('delivery_charge')?.setValue(this.deliveryCharge);
        });
      } else {
        this.makeOrderForm.get('delivery_charge')?.setValue(0);
      }
    });

  }

  subscribeToFormChanges() {
    this.makeOrderForm.get('product_price')?.valueChanges.subscribe(() => {
      this.calculateTotalAmount();
    });
    this.makeOrderForm.get('quantity')?.valueChanges.subscribe(() => {
      this.calculateTotalAmount();
    });
    this.makeOrderForm.get('delivery_charge')?.valueChanges.subscribe(() => {
      this.calculateTotalAmount();
    });
  }

  calculateTotalAmount() {
    const productPrice = this.makeOrderForm.get('product_price')?.value;
    const quantity = this.makeOrderForm.get('quantity')?.value;
    const deliveryCharge = this.makeOrderForm.get('delivery_charge')?.value;

    const totalAmount = (productPrice * quantity) + deliveryCharge;
    this.makeOrderForm.patchValue({ total_amount: totalAmount });
  }

  onSubmitForm() {
    this.commonService.onBufferEvent.emit(true);
    const postData = {
      ...this.makeOrderForm.value,
      delivery_charge: this.makeOrderForm.get('delivery_charge')?.value || 0
    }
    this.dataService.post(postData, 'website/order-product')
      .subscribe({
        next: (response) => {
          this.commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.dialogRef.close(true);
            this.commonService.openSnackBar(response.message, 'Close', 'submit-success');
            this.commonService.AClicked('component clicked');
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  getActiveProducts() {
    this.dataService.getJson('product-list', '')
      .subscribe({
        next: ({ data }) => {
          this.products = data;
        },
        error: error => {
          console.error(error);
        }
      })
  }

  closeModal() {
    this.dialogRef.close();
  }
}
