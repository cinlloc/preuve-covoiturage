import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Territory } from '~/core/entities/territory/territory';
import { Roles } from '~/core/enums/user/roles';
import { AuthenticationService } from '~/core/services/authentication/authentication.service';
import { TerritoryStoreService } from '~/modules/territory/services/territory-store.service';

@Component({
  selector: 'app-territory-list',
  templateUrl: './territory-list.component.html',
  styleUrls: ['./territory-list.component.scss'],
})
export class TerritoryListComponent {
  public readonly displayedColumns: string[] = ['name', 'actions'];

  @Input() territories: Territory[] = [];

  get canEdit(): boolean {
    return this.authenticationService.hasRole([Roles.RegistryAdmin]);
  }

  constructor(
    private router: Router,
    public authenticationService: AuthenticationService,
    public territoryStore: TerritoryStoreService,
  ) {}

  onEdit(territory: Territory): void {
    this.router.navigate(['/admin/all-territories/', territory._id]);
  }
}
