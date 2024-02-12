import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appointmentStatus'
})
export class AppointmentStatusPipe implements PipeTransform {

  transform(statusCode: number): string {
    switch (statusCode) {
      case 0:
        return 'Scheduled';
      case 1:
        return 'Confirmed';
      case 2:
        return 'Pending Confirmation';
      case 3:
        return 'Cancelled by Patient';
      case 4:
        return 'Cancelled by Doctor';
      case 5:
        return 'Rescheduled';
      case 6:
        return 'Completed';
      case 7:
        return 'In Progress';
      case 8:
        return 'Emergency';
      case 9:
        return 'Awaiting Treatment';
      case 10:
        return 'Follow-Up Required';
      default:
        return 'Unknown';
    }
  }

}
