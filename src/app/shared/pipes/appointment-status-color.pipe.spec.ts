import { AppointmentStatusColorPipe } from './appointment-status-color.pipe';

describe('AppointmentStatusColorPipe', () => {
  it('create an instance', () => {
    const pipe = new AppointmentStatusColorPipe();
    expect(pipe).toBeTruthy();
  });
});
