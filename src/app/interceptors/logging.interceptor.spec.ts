import { TestBed } from '@angular/core/testing';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoaderInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LoggingInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: LoggingInterceptor = TestBed.inject(LoggingInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
