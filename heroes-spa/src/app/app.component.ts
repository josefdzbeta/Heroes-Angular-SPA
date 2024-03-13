import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroesListComponent } from './pages/heroes/heroes-list/heroes-list.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, HeroesListComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	providers: [HttpClientModule],
})
export class AppComponent {
	title = 'heroes-spa';
}
