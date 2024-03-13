import { Component } from '@angular/core';
import { MatLabel, MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatCardActions, MatCardContent, MatCardHeader, MatCard, MatCardTitle } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { FormsModule, Validators } from '@angular/forms';
import { HeroesService } from '../../../../services/heroes.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Hero } from '../../../../interfaces/hero';
@Component({
	selector: 'app-heroes-edit',
	standalone: true,
	imports: [
		MatLabel,
		MatCardContent,
		MatCardActions,
		MatButtonModule,
		MatCard,
		MatCardHeader,
		MatFormField,
		MatCardTitle,
		MatInput,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
		UpperCasePipe,
		MatIconModule,
		TitleCasePipe,
	],
	templateUrl: './heroes-edit.component.html',
	styleUrl: './heroes-edit.component.scss',
})
export class HeroesEditComponent {
	editHeroForm: FormGroup;
	hero: Hero = { id: 0, name: '', superPower: '', image: '' };
	selectedFile?: File;
	previewUrl?: string;
	fileName: string = '';

	constructor(
		private fb: FormBuilder,
		private heroesService: HeroesService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.editHeroForm = this.fb.group({
			name: ['', [Validators.required, Validators.pattern(/^.{3,}$/)]],
			superPower: ['', Validators.required],
		});
	}

	ngOnInit(): void {
		this.getHero();
	}

	getHero(): void {
		const id = +this.route.snapshot.paramMap.get('id')!;
		this.heroesService.getHeroById(id).subscribe((heroData) => {
			this.hero = heroData;
			this.editHeroForm.patchValue({
				name: heroData.name.toUpperCase(),
				superPower: heroData.superPower,
			});
			this.previewUrl = heroData.image;
		});
	}

	onFileSelected(event: any): void {
		const file = (event.target as HTMLInputElement).files![0];
		if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
			this.fileName = file.name;
			const reader = new FileReader();
			reader.onload = (e) => {
				this.hero.image = (e.target as FileReader).result as string;
				this.previewUrl = this.hero.image;
			};
			reader.readAsDataURL(file);
		} else {
			alert('Only JPEG and PNG files are allowed.');
		}
	}

	onSubmit(): void {
		if (this.editHeroForm.valid) {
			const formModel = this.editHeroForm.value;
			const saveHero: Hero = {
				id: this.hero.id,
				name: formModel.name,
				superPower: formModel.superPower,
				image: this.previewUrl || this.hero.image,
			};

			this.heroesService.updateHero(saveHero).subscribe(() => {
				this.router.navigate(['/heroes']);
			});
		}
	}

	cancel(): void {
		this.router.navigate(['/heroes']);
	}
}
