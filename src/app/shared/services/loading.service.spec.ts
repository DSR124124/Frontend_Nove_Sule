import { TestBed } from '@angular/core/testing';
import { LoadingService, LoadingState } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with isLoading false', (done) => {
    service.loading$.subscribe(state => {
      expect(state.isLoading).toBeFalse();
      expect(service.isLoading).toBeFalse();
      done();
    });
  });

  describe('Basic Loading Operations', () => {
    it('should show loading with default options', () => {
      service.show();
      expect(service.isLoading).toBeTrue();

      service.loading$.subscribe(state => {
        expect(state.isLoading).toBeTrue();
        expect(state.size).toBe('medium');
        expect(state.color).toBe('primary');
        expect(state.overlay).toBeFalse();
        expect(state.fullScreen).toBeFalse();
      });
    });

    it('should hide loading', () => {
      service.show();
      expect(service.isLoading).toBeTrue();

      service.hide();
      expect(service.isLoading).toBeFalse();
    });

    it('should show loading with custom options', () => {
      const options = {
        message: 'Loading...',
        size: 'large' as const,
        color: 'secondary' as const,
        overlay: true
      };

      service.show(options);

      service.loading$.subscribe(state => {
        expect(state.message).toBe('Loading...');
        expect(state.size).toBe('large');
        expect(state.color).toBe('secondary');
        expect(state.overlay).toBeTrue();
      });
    });
  });

  describe('Multiple Loaders Management', () => {
    it('should handle multiple loaders', () => {
      service.show({ id: 'loader1' });
      service.show({ id: 'loader2' });

      expect(service.isLoading).toBeTrue();
      expect(service.isLoaderActive('loader1')).toBeTrue();
      expect(service.isLoaderActive('loader2')).toBeTrue();
      expect(service.getActiveLoaders()).toEqual(['loader1', 'loader2']);
    });

    it('should only hide when all loaders are removed', () => {
      service.show({ id: 'loader1' });
      service.show({ id: 'loader2' });

      service.hide('loader1');
      expect(service.isLoading).toBeTrue(); // Still loading because loader2 is active

      service.hide('loader2');
      expect(service.isLoading).toBeFalse(); // Now it should be hidden
    });

    it('should hide all loaders at once', () => {
      service.show({ id: 'loader1' });
      service.show({ id: 'loader2' });
      service.show({ id: 'loader3' });

      expect(service.getActiveLoaders().length).toBe(3);

      service.hideAll();
      expect(service.isLoading).toBeFalse();
      expect(service.getActiveLoaders().length).toBe(0);
    });
  });

  describe('Convenience Methods', () => {
    it('should show overlay loading', () => {
      service.showOverlay('Processing...');

      service.loading$.subscribe(state => {
        expect(state.isLoading).toBeTrue();
        expect(state.message).toBe('Processing...');
        expect(state.overlay).toBeTrue();
        expect(state.fullScreen).toBeFalse();
      });
    });

    it('should show fullscreen loading', () => {
      service.showFullScreen('Please wait...');

      service.loading$.subscribe(state => {
        expect(state.isLoading).toBeTrue();
        expect(state.message).toBe('Please wait...');
        expect(state.overlay).toBeFalse();
        expect(state.fullScreen).toBeTrue();
        expect(state.size).toBe('large');
      });
    });

    it('should show small loading', () => {
      service.showSmall('Loading...');

      service.loading$.subscribe(state => {
        expect(state.isLoading).toBeTrue();
        expect(state.message).toBe('Loading...');
        expect(state.size).toBe('small');
        expect(state.overlay).toBeFalse();
        expect(state.fullScreen).toBeFalse();
      });
    });
  });

  describe('withLoading method', () => {
    it('should execute operation with automatic loading', async () => {
      const mockOperation = jasmine.createSpy('operation').and.returnValue(
        Promise.resolve('result')
      );

      const result = await service.withLoading(mockOperation, {
        message: 'Processing...'
      });

      expect(mockOperation).toHaveBeenCalled();
      expect(result).toBe('result');
      expect(service.isLoading).toBeFalse(); // Should be hidden after completion
    });

    it('should hide loading even if operation fails', async () => {
      const mockOperation = jasmine.createSpy('operation').and.returnValue(
        Promise.reject(new Error('Operation failed'))
      );

      try {
        await service.withLoading(mockOperation);
      } catch (error) {
        expect(error.message).toBe('Operation failed');
      }

      expect(service.isLoading).toBeFalse(); // Should be hidden even after error
    });
  });

  describe('Loader Status Checking', () => {
    it('should check if specific loader is active', () => {
      expect(service.isLoaderActive('test')).toBeFalse();

      service.show({ id: 'test' });
      expect(service.isLoaderActive('test')).toBeTrue();

      service.hide('test');
      expect(service.isLoaderActive('test')).toBeFalse();
    });

    it('should return list of active loaders', () => {
      expect(service.getActiveLoaders()).toEqual([]);

      service.show({ id: 'loader1' });
      service.show({ id: 'loader2' });

      const activeLoaders = service.getActiveLoaders();
      expect(activeLoaders).toContain('loader1');
      expect(activeLoaders).toContain('loader2');
      expect(activeLoaders.length).toBe(2);
    });
  });
});
