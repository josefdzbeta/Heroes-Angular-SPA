import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';

import { heroOperationInterceptor } from './hero-operation.interceptor';

describe('heroOperationInterceptor', () => {
	const interceptor: HttpInterceptorFn = (req, next) =>
		TestBed.runInInjectionContext(() => heroOperationInterceptor(req, next));

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it('should be created', () => {
		expect(interceptor).toBeTruthy();
	});
});
