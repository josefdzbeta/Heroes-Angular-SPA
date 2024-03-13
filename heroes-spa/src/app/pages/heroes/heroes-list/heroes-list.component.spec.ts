import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HeroesListComponent } from './heroes-list.component';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeroesListComponent', () => {
	let component: HeroesListComponent;
	let fixture: ComponentFixture<HeroesListComponent>;
	let dialogSpy: jasmine.Spy;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MatDialogModule,
				BrowserAnimationsModule,
				HttpClientTestingModule,
				RouterTestingModule,
				HeroesListComponent,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(HeroesListComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
		dialogSpy = spyOn(component.dialog, 'open').and.returnValue({
			afterClosed: () => of(true),
		} as MatDialogRef<typeof component>);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should open the delete confirmation dialog', () => {
		component.openDeleteConfirmDialog({ id: 1, name: 'Test Hero', superPower: 'Invisibility', image: 'url' });
		expect(dialogSpy).toHaveBeenCalled();
	});
});
