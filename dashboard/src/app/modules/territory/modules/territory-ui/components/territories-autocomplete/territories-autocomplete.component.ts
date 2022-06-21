import { debounceTime, filter, map, takeUntil, tap } from 'rxjs/operators';

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { DestroyObservable } from '~/core/components/destroy-observable';
import { TerritoryApiService } from '~/modules/territory/services/territory-api.service';
import { ResultWithPagination } from '~/shared/common/interfaces/ResultWithPagination';
import {
  ParamsInterface as ParamsInterfaceGeo,
  SingleResultInterface as TerritoryGeoResultInterface,
} from '~/shared/territory/listGeo.contract';

import { SingleResultInterface as SingleGeoResult } from '~/shared/territory/listGeo.contract';

@Component({
  selector: 'app-territories-autocomplete',
  templateUrl: './territories-autocomplete.component.html',
  styleUrls: ['./territories-autocomplete.component.scss'],
})
export class TerritoriesAutocompleteComponent extends DestroyObservable implements OnInit {
  // with control 'territoryIds'
  @Input() parentForm: FormGroup;
  @Input() placeholder = 'Ajouter un territoire';
  @Input() title = 'Territoires';
  @Input() label = 'Ajouter un territoire';

  @ViewChild('territoryInput') territoryInput: ElementRef;

  public filteredTerritories: SingleGeoResult[];
  public selectedTerritories: SingleGeoResult[] = [];

  public territoryCtrl = new FormControl();

  get territoryIdsControl(): FormControl {
    return this.parentForm.get('territoryIds') as FormControl;
  }

  constructor(private territoryApiService: TerritoryApiService) {
    super();
  }

  ngOnInit(): void {
    this.territoryCtrl.valueChanges
      .pipe(
        debounceTime(100),
        map((literal) => literal.trim()),
        filter((literal) => !!literal && literal.length > 1),
        tap((literal) => this.filterTerritory(literal)),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  public getTerritoryLabel(territoryId): string {
    return this.selectedTerritories.find((territory) => territory.insee === territoryId).name;
  }

  public remove(territoryId: string): void {
    const index = this.territoryIdsControl.value.indexOf(territoryId);

    if (index >= 0) {
      const territories = [...this.territoryIdsControl.value];
      territories.splice(index, 1);
      this.territoryIdsControl.setValue(territories);
    }

    const selectedTerritoriesInd = this.selectedTerritories.findIndex((terr) => terr.insee === territoryId);

    if (selectedTerritoriesInd >= 0) {
      this.selectedTerritories.splice(selectedTerritoriesInd, 1);
    }
  }

  public onTerritorySelect(event: MatAutocompleteSelectedEvent): void {
    const territories: SingleGeoResult[] = this.territoryIdsControl.value || [];
    territories.push(event.option.value);

    this.selectedTerritories.push(this.filteredTerritories.find((terr) => terr.insee === event.option.value));

    this.territoryIdsControl.setValue(territories);
    this.territoryInput.nativeElement.value = null;
    this.territoryCtrl.setValue('');
  }

  private filterTerritory(literal = ''): void {
    const params: ParamsInterfaceGeo = { search: literal };
    this.territoryApiService
      .geo(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: ResultWithPagination<TerritoryGeoResultInterface>) => {
        this.filteredTerritories = result.data;
      });
  }
}
