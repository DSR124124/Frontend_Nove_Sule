import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';
import { LoadingService } from '../../services/loading.service';
import { BehaviorSubject } from 'rxjs';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let loadingSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject({ isLoading: false });

    const loadingServiceSpy = jasmine.createSpyObj('LoadingService',
      ['show', 'hide', 'showOverlay', 'showFullScreen'],
      { loading$: loadingSubject.asObservable() }
    );

    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
      providers: [
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Manual Mode (useGlobalService: false)', () => {
    beforeEach(() => {
      component.useGlobalService = false;
      fixture.detectChanges();
    });

    it('should not show spinner by default', () => {
      expect(component.shouldShow).toBeFalse();
    });

    it('should show spinner when show input is true', () => {
      component.show = true;
      expect(component.shouldShow).toBeTrue();
    });

    it('should apply size classes correctly', () => {
      component.show = true;
      component.size = 'large';
      fixture.detectChanges();

      const spinnerElement = fixture.nativeElement.querySelector('.spinner');
      expect(spinnerElement.classList.contains('large')).toBeTrue();
    });

    it('should apply color classes correctly', () => {
      component.show = true;
      component.color = 'secondary';
      fixture.detectChanges();

      const spinnerElement = fixture.nativeElement.querySelector('.spinner');
      expect(spinnerElement.classList.contains('secondary')).toBeTrue();
    });

    it('should show message when provided', () => {
      component.show = true;
      component.message = 'Loading test...';
      fixture.detectChanges();

      const messageElement = fixture.nativeElement.querySelector('.loading-message');
      expect(messageElement.textContent.trim()).toBe('Loading test...');
    });

    it('should apply overlay class when overlay is true', () => {
      component.show = true;
      component.overlay = true;
      fixture.detectChanges();

      const containerElement = fixture.nativeElement.querySelector('.loading-container');
      expect(containerElement.classList.contains('overlay')).toBeTrue();
    });

    it('should apply full-screen class when fullScreen is true', () => {
      component.show = true;
      component.fullScreen = true;
      fixture.detectChanges();

      const containerElement = fixture.nativeElement.querySelector('.loading-container');
      expect(containerElement.classList.contains('full-screen')).toBeTrue();
    });
  });

  describe('Global Service Mode (useGlobalService: true)', () => {
    beforeEach(() => {
      component.useGlobalService = true;
    });

    it('should subscribe to loading service on init', () => {
      component.ngOnInit();
      expect(component.subscription).toBeDefined();
    });

    it('should show spinner when service emits loading state', () => {
      component.ngOnInit();

      loadingSubject.next({
        isLoading: true,
        message: 'Service loading...',
        size: 'large',
        color: 'secondary',
        overlay: true
      });

      fixture.detectChanges();

      expect(component.shouldShow).toBeTrue();
      expect(component.message).toBe('Service loading...');
      expect(component.size).toBe('large');
      expect(component.color).toBe('secondary');
      expect(component.overlay).toBeTrue();
    });

    it('should hide spinner when service emits non-loading state', () => {
      component.ngOnInit();

      // First show loading
      loadingSubject.next({ isLoading: true });
      expect(component.shouldShow).toBeTrue();

      // Then hide loading
      loadingSubject.next({ isLoading: false });
      expect(component.shouldShow).toBeFalse();
    });

    it('should call service methods when using convenience methods', () => {
      component.ngOnInit();

      component.showLoading('Test message');
      expect(loadingService.show).toHaveBeenCalledWith({ message: 'Test message' });

      component.hideLoading();
      expect(loadingService.hide).toHaveBeenCalled();
    });

    it('should unsubscribe on destroy', () => {
      component.ngOnInit();
      const subscription = component.subscription;
      spyOn(subscription!, 'unsubscribe');

      component.ngOnDestroy();
      expect(subscription!.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('Component Lifecycle', () => {
    it('should not subscribe to service when useGlobalService is false', () => {
      component.useGlobalService = false;
      component.ngOnInit();

      expect(component.subscription).toBeUndefined();
    });

    it('should handle destroy without subscription', () => {
      component.subscription = undefined;
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });
});
