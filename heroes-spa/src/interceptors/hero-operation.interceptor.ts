import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { tap } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export const heroOperationInterceptor: HttpInterceptorFn = (
	request: HttpRequest<any>,
	next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
	const isHeroOperation = ['POST', 'PUT', 'DELETE'].includes(request.method);

	return next(request).pipe(
		tap((evt) => {
			if (evt instanceof HttpResponse && isHeroOperation) {
				let operation = 'updated';
				if (request.method === 'POST') {
					operation = 'created';
				} else if (request.method === 'DELETE') {
					operation = 'deleted';
				}

				Swal.fire({
					icon: 'success',
					title: 'Operation Successful',
					text: `The hero has been ${operation} successfully.`,
					timer: 3000,
					timerProgressBar: true,
				});
			}
		}),
		catchError((error: HttpErrorResponse) => {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong! ' + (error.error?.message || error.message),
				timer: 3000,
				timerProgressBar: true,
			});
			return throwError(() => new Error(error.error.message || 'An error occurred during the hero operation'));
		}),
	);
};
