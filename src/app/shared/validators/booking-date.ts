export function bookingDateValidator(control: any) {
  const selectedDate = new Date(control.value);
  const currentDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(currentDate.getDate() + 10);

  currentDate.setHours(0, 0, 0, 0);

  const dayOfWeek = selectedDate.getDay();
  
  if (dayOfWeek === 5 || dayOfWeek === 6) { 

    return { 'disabledDate': { value: selectedDate } };
  }

  if (selectedDate < currentDate) {
    return { 'invalidBookingDate': true };
  }
  if (selectedDate > maxDate) {
    return { 'exceedBookingDate': true };
  }

  return null;
}