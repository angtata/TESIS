import { NgModule } from '@angular/core';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [ProgressBarComponent],
	imports: [ CommonModule, IonicModule,],
	exports: [ProgressBarComponent]
})
export class ComponentsModule {}
