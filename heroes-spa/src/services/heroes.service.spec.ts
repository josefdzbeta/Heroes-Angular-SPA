import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HeroesService } from './heroes.service';
import { environment } from '../environments/environment';
import { Hero } from '../interfaces/hero';
describe('HeroesService', () => {
	let service: HeroesService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [HeroesService],
		});
		service = TestBed.inject(HeroesService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should fetch heroes and apply filter correctly', () => {
		const mockHeroes = [
			{ id: 1, name: 'Batman' },
			{ id: 2, name: 'Superman' },
		];

		service.getHeroes('bat').subscribe((heroes) => {
			expect(heroes.length).toBe(1);
			expect(heroes[0].name).toBe('Batman');
		});

		const req = httpMock.expectOne(`${environment.apiUrl}/heroes`);
		expect(req.request.method).toBe('GET');
		req.flush(mockHeroes);
	});
	it('should create a hero and return it', () => {
		const newHero: Hero = {
			id: 3,
			name: 'Wonder Woman',
			superPower: 'Super Strength',
			image: 'wonder-woman-image.jpg',
		};

		service.createHero(newHero).subscribe((hero) => {
			expect(hero).toEqual(newHero);
		});

		const req = httpMock.expectOne(`${environment.apiUrl}/heroes`);
		expect(req.request.method).toBe('POST');
		expect(req.request.body).toEqual(newHero);
		req.flush(newHero);
	});
	it('should retrieve a hero by ID', () => {
		const mockHero: Hero = {
			id: 1,
			name: 'Batman',
			superPower: 'Intellect',
			image: 'batman-image.jpg',
		};

		service.getHeroById(1).subscribe((hero) => {
			expect(hero).toEqual(mockHero);
		});

		const req = httpMock.expectOne(`${environment.apiUrl}/heroes/1`);
		expect(req.request.method).toBe('GET');
		req.flush(mockHero);
	});

	it('should delete a hero by ID and return the deleted hero', () => {
		const heroIdToDelete = 1;
		const mockDeleteResponse: Hero = {
			id: heroIdToDelete,
			name: 'Batman',
			superPower: 'Intellect',
			image: 'batman-image.jpg',
		};

		service.deleteHero(heroIdToDelete).subscribe((response) => {
			expect(response).toEqual(mockDeleteResponse);
		});

		const req = httpMock.expectOne(`${environment.apiUrl}/heroes/${heroIdToDelete}`);
		expect(req.request.method).toBe('DELETE');
		req.flush(mockDeleteResponse);
	});
});
