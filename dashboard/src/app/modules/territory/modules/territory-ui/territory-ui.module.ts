import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '~/shared/modules/material/material.module';
import { FormModule } from '~/shared/modules/form/form.module';

import { TerritoryFormComponent } from './components/territory-form/territory-form.component';
// tslint:disable-next-line:max-line-length
import { TerritoriesAutocompleteComponent } from './components/territories-autocomplete/territories-autocomplete.component';
import { TerritoryAutocompleteComponent } from './components/territory-autocomplete/territory-autocomplete.component';

@NgModule({
  declarations: [TerritoryFormComponent, TerritoriesAutocompleteComponent, TerritoryAutocompleteComponent],
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule, FormModule],
  exports: [TerritoryFormComponent, TerritoriesAutocompleteComponent, TerritoryAutocompleteComponent],
})
export class TerritoryUiModule {}