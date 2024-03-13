import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { Hero } from '../../../../interfaces/hero';
import { HeroesService } from '../../../../services/heroes.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
	MatDialog,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogTitle,
} from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TitleCasePipe, AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable, debounceTime, startWith, switchMap } from 'rxjs';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { distinctUntilChanged } from 'rxjs';
import { tap } from 'rxjs';
@Component({
	selector: 'app-heroes-list',
	standalone: true,
	imports: [
		MatInputModule,
		MatButtonModule,
		MatListModule,
		MatIconModule,
		MatDialogModule,
		FormsModule,
		TitleCasePipe,
		AsyncPipe,
		MatCardModule,
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
		MatDialogClose,
		MatButtonModule,
		RouterModule,
		MatProgressSpinnerModule,
	],
	templateUrl: './heroes-list.component.html',
	styleUrl: './heroes-list.component.scss',
})
export class HeroesListComponent implements OnInit {
	heroes$: Observable<Hero[]> = of([]);
	filterQuery: string = '';
	isLoading!: boolean;
	private searchText$ = new BehaviorSubject<string>('');

	constructor(
		public dialog: MatDialog,
		private heroesService: HeroesService,
	) {}

	ngOnInit(): void {
		this.isLoading = true;
		this.heroes$ = this.searchText$.pipe(
			startWith(''),
			debounceTime(1000),
			distinctUntilChanged(),
			switchMap((name) => this.heroesService.getHeroes(name)),
			tap(() => (this.isLoading = false)),
		);
	}

	applyFilter(): void {
		this.searchText$.next(this.filterQuery);
	}
	openDeleteConfirmDialog(hero: Hero): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '300px',
			data: { heroId: hero.id, heroName: hero.name },
		});

		dialogRef.afterClosed().subscribe((result: boolean) => {
			if (result) {
				this.heroesService.deleteHero(hero.id).subscribe(() => {});
				this.heroes$ = this.searchText$.pipe(
					startWith(''),
					debounceTime(300),
					distinctUntilChanged(),
					switchMap((name) => this.heroesService.getHeroes(name)),
					tap(() => (this.isLoading = false)),
				);
			}
		});
	}
}
