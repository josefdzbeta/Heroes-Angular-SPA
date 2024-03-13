import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfirmDialogComponent', () => {
	let component: ConfirmDialogComponent;
	let fixture: ComponentFixture<ConfirmDialogComponent>;

	const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);

	const dialogData = { heroId: 1, heroName: 'test hero' };

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ConfirmDialogComponent, MatButtonModule, MatProgressBarModule, NoopAnimationsModule],
			providers: [
				{ provide: MatDialogRef, useValue: dialogRefSpyObj },
				{ provide: MAT_DIALOG_DATA, useValue: dialogData },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ConfirmDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should close the dialog with true on confirm', () => {
		component.onConfirm();
		expect(dialogRefSpyObj.close).toHaveBeenCalledWith(true);
	});

	it('should close the dialog with false on dismiss', () => {
		component.onDismiss();
		expect(dialogRefSpyObj.close).toHaveBeenCalledWith(false);
	});
});
