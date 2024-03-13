import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesEditComponent } from './heroes-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HeroesService } from '../../../../services/heroes.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
describe('HeroesEditComponent', () => {
	let component: HeroesEditComponent;
	let fixture: ComponentFixture<HeroesEditComponent>;
	let mockHeroesService: any;
	let mockActivatedRoute: any;
	let mockRouter: any;

	beforeEach(async () => {
		mockHeroesService = jasmine.createSpyObj('HeroesService', ['getHeroById', 'updateHero']);
		mockHeroesService.getHeroById.and.returnValue(
			of({ id: 1, name: 'Test Hero', superPower: 'Test Power', image: 'test.jpg' }),
		);
		mockActivatedRoute = {
			snapshot: {
				paramMap: {
					get: jasmine.createSpy('get').and.returnValue('1'),
				},
			},
		};
		mockRouter = jasmine.createSpyObj('Router', ['navigate']);

		await TestBed.configureTestingModule({
			imports: [
				HeroesEditComponent,
				ReactiveFormsModule,
				HttpClientTestingModule,
				RouterTestingModule,
				NoopAnimationsModule,
				MatButtonModule,
				MatCardModule,
				MatInputModule,
				MatFormFieldModule,
			],
			providers: [
				{ provide: HeroesService, useValue: mockHeroesService },
				{ provide: ActivatedRoute, useValue: mockActivatedRoute },
				{ provide: Router, useValue: mockRouter },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(HeroesEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize with hero data', () => {
		fixture.detectChanges();

		expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
		expect(mockHeroesService.getHeroById).toHaveBeenCalledWith(1);
		expect(component.editHeroForm.value).toEqual({
			name: 'TEST HERO',
			superPower: 'Test Power',
		});
	});

	it('should fetch hero data and set form values on init', () => {
		const expectedHero = { id: 1, name: 'Test Hero', superPower: 'Test Power', image: '' };
		mockHeroesService.getHeroById.and.returnValue(of(expectedHero));
		component.ngOnInit();

		expect(component.editHeroForm.value).toEqual({
			name: expectedHero.name.toUpperCase(),
			superPower: expectedHero.superPower,
		});
	});

	it('should validate the name field correctly', () => {
		const nameInput = component.editHeroForm.controls['name'];
		nameInput.setValue('');
		expect(nameInput.valid).toBeFalsy();

		nameInput.setValue('a');
		expect(nameInput.valid).toBeFalsy();

		nameInput.setValue('Valid Name');
		expect(nameInput.valid).toBeTruthy();
	});

	it('should call updateHero when the form is valid and submitted', () => {
		component.editHeroForm.setValue({
			name: 'Updated Hero',
			superPower: 'Updated Power',
		});
		mockHeroesService.updateHero.and.returnValue(of({}));

		component.onSubmit();

		expect(mockHeroesService.updateHero).toHaveBeenCalledWith(
			jasmine.objectContaining({
				name: 'Updated Hero',
				superPower: 'Updated Power',
			}),
		);
		expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
	});

	it('should not call updateHero when the form is invalid', () => {
		component.editHeroForm.setValue({
			name: '',
			superPower: 'Some Power',
		});

		component.onSubmit();

		expect(mockHeroesService.updateHero).not.toHaveBeenCalled();
	});

	it('should navigate back to heroes list on cancel', () => {
		component.cancel();
		expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
	});
});
