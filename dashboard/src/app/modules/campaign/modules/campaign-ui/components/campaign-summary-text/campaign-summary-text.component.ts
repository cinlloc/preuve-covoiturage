import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { CampaignUx } from '~/core/entities/campaign/ux-format/campaign-ux';
import { UtilsService } from '~/core/services/utils.service';

@Component({
  selector: 'app-campaign-summary-text',
  templateUrl: './campaign-summary-text.component.html',
  styleUrls: ['./campaign-summary-text.component.scss'],
})
export class CampaignSummaryTextComponent {
  @Input() campaign: CampaignUx;

  constructor(private _utils: UtilsService, private _toastr: ToastrService) {}

  get summary(): string {
    return this.campaign.description;
  }

  copySummary(): void {
    this._utils.copySelectionToClipboarcById('summary');
    this._toastr.success('Le récapitulatif a été copié !');
  }
}
