import { Component } from '@angular/core';
import { MatLabel, MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatCardActions, MatCardContent, MatCardHeader, MatCard, MatCardTitle } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { HeroesService } from '../../../../services/heroes.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
@Component({
	selector: 'app-heroes-create',
	standalone: true,
	imports: [
		MatLabel,
		MatFormField,
		MatFormFieldModule,
		MatCardActions,
		MatCardContent,
		MatCardHeader,
		MatCard,
		MatCardTitle,
		MatButtonModule,
		MatInput,
		FormsModule,
		ReactiveFormsModule,
		UpperCasePipe,
		MatIconModule,
		TitleCasePipe,
	],
	templateUrl: './heroes-create.component.html',
	styleUrl: './heroes-create.component.scss',
})
export class HeroesCreateComponent {
	heroForm: FormGroup;
	selectedFile?: File;
	previewUrl?: string;
	fileName: string = '';

	constructor(
		private fb: FormBuilder,
		private heroesService: HeroesService,
		private router: Router,
	) {
		this.heroForm = this.fb.group({
			name: ['', Validators.required],
			superPower: ['', Validators.required],
			image: ['', Validators.required],
		});
	}

	onFileSelected(event: any): void {
		const element = event.currentTarget as HTMLInputElement;
		const fileList: FileList | null = element.files;
		if (fileList && fileList.length > 0) {
			this.selectedFile = fileList[0];
			this.fileName = this.selectedFile.name;
			this.previewUrl = URL.createObjectURL(this.selectedFile);

			this.heroForm.patchValue({ image: this.previewUrl });
			this.heroForm.get('image')?.updateValueAndValidity();
		}
	}

	onSubmit(): void {
		if (this.heroForm.valid && this.selectedFile) {
			const formValue = this.heroForm.value;
			formValue.name = formValue.name.toLowerCase();

			this.heroesService.createHero(formValue).subscribe(() => {
				this.router.navigate(['/heroes']);
			});
		}
	}

	cancel(): void {
		this.router.navigate(['/heroes']);
	}
}
