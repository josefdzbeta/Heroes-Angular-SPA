import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { Hero } from '../interfaces/hero';

@Injectable({
	providedIn: 'root',
})
export class HeroesService {
	private apiUrl = environment.apiUrl;

	constructor(private http: HttpClient) {}

	getHeroes(filter: string = ''): Observable<Hero[]> {
		return this.http
			.get<Hero[]>(`${this.apiUrl}/heroes`)
			.pipe(map((heroes: Hero[]) => heroes.filter((hero) => hero.name.toLowerCase().includes(filter.toLowerCase()))));
	}

	getHeroById(id: number): Observable<Hero> {
		return this.http.get<Hero>(`${this.apiUrl}/heroes/${id}`);
	}

	createHero(hero: Hero): Observable<Hero> {
		return this.http.post<Hero>(`${this.apiUrl}/heroes`, hero);
	}
	updateHero(hero: Hero): Observable<Hero> {
		return this.http.put<Hero>(`${this.apiUrl}/heroes/${hero.id}`, hero);
	}

	deleteHero(id: number): Observable<Hero> {
		return this.http.delete<Hero>(`${this.apiUrl}/heroes/${id}`);
	}
}
