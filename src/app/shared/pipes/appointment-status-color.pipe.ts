import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appointmentStatusColor'
})
export class AppointmentStatusColorPipe implements PipeTransform {

  transform(statusCode: number): string {
    switch (statusCode) {
      case 0:
        return 'blue'; // Scheduled
      case 1:
        return 'green'; // Confirmed
      case 2:
        return 'orange'; // Pending Confirmation
      case 3:
        return 'red'; // Cancelled by Patient
      case 4:
        return 'red'; // Cancelled by Doctor
      case 5:
        return 'orange'; // Rescheduled
      case 6:
        return 'gray'; // Completed
      case 7:
        return 'purple'; // In Progress
      case 8:
        return 'red'; // Emergency
      case 9:
        return 'yellow'; // Awaiting Treatment
      case 10:
        return 'orange'; // Follow-Up Required
      default:
        return 'black'; // Unknown
    }
  }

}
