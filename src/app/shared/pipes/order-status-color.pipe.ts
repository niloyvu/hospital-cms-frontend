import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatusColor'
})
export class OrderStatusColorPipe implements PipeTransform {

  transform(statusCode: number): string {
    switch (statusCode) {
      case 0:
        return 'blue'; // Pending
      case 1:
        return 'orange'; // Processing
      case 2:
        return 'green'; // Shipped
      case 3:
        return 'purple'; // Delivered
      case 4:
        return 'red'; // Cancelled
      case 5:
        return 'brown'; // Refunded
      case 6:
        return 'gray'; // Returned
      case 7:
        return 'yellow'; // On Hold
      case 8:
        return 'cyan'; // Completed
      case 9:
        return 'black'; // Failed
      default:
        return 'black'; // Unknown
    }
  }
}
