import { Routes } from '@angular/router';
import { HeroesListComponent } from './pages/heroes/heroes-list/heroes-list.component';
import { HeroesEditComponent } from './pages/heroes/heroes-edit/heroes-edit.component';
import { HeroesCreateComponent } from './pages/heroes/heroes-create/heroes-create.component';

export const routes: Routes = [
	{ path: '', redirectTo: '/heroes', pathMatch: 'full' },
	{ path: 'heroes', component: HeroesListComponent },
	{ path: 'edit-hero/:id', component: HeroesEditComponent },
	{ path: 'create-hero', component: HeroesCreateComponent },
];
