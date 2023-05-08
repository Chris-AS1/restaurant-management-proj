import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';

const MaterialComponents = [
  MatRadioModule
]

@NgModule({
  imports: [
    MaterialComponents
  ],
  exports: [
    MaterialComponents
  ]
})
export class MaterialModule { }
