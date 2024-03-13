import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesCreateComponent } from './heroes-create.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HeroesService } from '../../../../services/heroes.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { of } from 'rxjs';

describe('HeroesCreateComponent', () => {
	let component: HeroesCreateComponent;
	let fixture: ComponentFixture<HeroesCreateComponent>;
	let mockHeroesService: any;
	let mockRouter: any;

	beforeEach(async () => {
		mockHeroesService = jasmine.createSpyObj(['createHero']);
		mockRouter = { navigate: jasmine.createSpy('navigate') };

		await TestBed.configureTestingModule({
			imports: [
				HeroesCreateComponent,
				ReactiveFormsModule,
				FormsModule,
				HttpClientTestingModule,
				RouterTestingModule,
				NoopAnimationsModule,
				MatInputModule,
				MatButtonModule,
				MatCardModule,
				MatFormFieldModule,
			],
			providers: [
				{ provide: HeroesService, useValue: mockHeroesService },
				{ provide: Router, useValue: mockRouter },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(HeroesCreateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have the correct initial form state', () => {
		expect(component.heroForm.valid).toBeFalsy();
		expect(component.heroForm.controls['name'].value).toEqual('');
		expect(component.heroForm.controls['superPower'].value).toEqual('');
		expect(component.heroForm.controls['image'].value).toEqual('');
	});

	it('should validate the form fields correctly', () => {
		const nameControl = component.heroForm.controls['name'];
		const superPowerControl = component.heroForm.controls['superPower'];

		nameControl.setValue('');
		expect(nameControl.valid).toBeFalsy();

		nameControl.setValue('Batman');
		expect(nameControl.valid).toBeTruthy();

		superPowerControl.setValue('');
		expect(superPowerControl.valid).toBeFalsy();

		superPowerControl.setValue('Super Strength');
		expect(superPowerControl.valid).toBeTruthy();
	});

	it('should call createHero when the form is valid and submitted', () => {
		// Prepare the form values
		const mockHero = {
			name: 'New Hero',
			superPower: 'Flight',
			// Note: image is not set here because we'll simulate file selection
		};

		// Simulate the file being selected
		const blob = new Blob([''], { type: 'image/png' });
		const mockFile = new File([blob], 'testImage.png', { type: 'image/png' });
		component.selectedFile = mockFile; // Simulate the file selection
		component.previewUrl = 'data:image/png;base64,...'; // Simulate the file preview

		// Now set the form values
		component.heroForm.setValue({
			name: mockHero.name,
			superPower: mockHero.superPower,
			image: component.previewUrl, // This should be set as if the file was selected
		});

		// Ensure the form is valid now
		expect(component.heroForm.valid).toBeTrue();

		// Mock the service call
		mockHeroesService.createHero.and.returnValue(of({}));

		// Submit the form
		component.onSubmit();

		// Check that the service was called with the lowercased name and previewUrl as image
		expect(mockHeroesService.createHero).toHaveBeenCalledWith(
			jasmine.objectContaining({
				name: mockHero.name.toLowerCase(),
				superPower: mockHero.superPower,
				image: component.previewUrl,
			}),
		);

		// Check that the navigation was triggered
		expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
	});

	it('should navigate back to heroes list on cancel', () => {
		component.cancel();
		expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
	});

	it('should navigate back to heroes list on cancel, even if the form is invalid', () => {
		component.heroForm.setValue({
			name: '',
			superPower: '',
			image: '',
		});

		component.cancel();

		expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
	});
});
