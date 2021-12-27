import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { TerritoryLevelEnum } from '../../../../../../../../../shared/territory/common/interfaces/TerritoryInterface';
import { User } from '../../../../../../core/entities/authentication/user';
import { Address } from '../../../../../../core/entities/shared/address';
import { Company } from '../../../../../../core/entities/shared/company';
import { CompanyV2 } from '../../../../../../core/entities/shared/companyV2';
import { Contact } from '../../../../../../core/entities/shared/contact';
import { Contacts } from '../../../../../../core/entities/shared/contacts';
import { Territory, TerritoryBase } from '../../../../../../core/entities/territory/territory';
import { Groups } from '../../../../../../core/enums/user/groups';
import { Roles } from '../../../../../../core/enums/user/roles';
import { AuthenticationService } from '../../../../../../core/services/authentication/authentication.service';
import { FormAddress } from '../../../../../../shared/modules/form/forms/form-address';
import { FormCompany } from '../../../../../../shared/modules/form/forms/form-company';
import { FormContact } from '../../../../../../shared/modules/form/forms/form-contact';
import { CompanyService } from '../../../../../company/services/company.service';
import { TerritoryApiService } from '../../../../services/territory-api.service';
import { TerritoryStoreService } from '../../../../services/territory-store.service';
import { TerritoryFormComponent } from './territory-form.component';

describe('TerritoryFormComponent', () => {
  const territoryApiServiceSpy = jasmine.createSpyObj<TerritoryApiService>('TerritoryApiService', {
    createNew: of({
      level: TerritoryLevelEnum.Towngroup,
      name: "Communauté de communes du Pays de L'Arbresle",
      company_id: 3,
      children: [1, 2],
      address: {
        street: '',
        postcode: '',
        city: '',
        country: '',
      },
    }),
    findByInsees: of([
      { territory_id: 1, name: '' },
      { territory_id: 2, name: '' },
    ]),
  });

  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [TerritoryFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        {
          provide: CompanyService,
          useValue: {
            getById(id: number): Observable<Partial<CompanyV2>> {
              return of({
                siret: '24690062500012',
                siren: null,
                legal_name: 'COMMUNAUTE COMMUNES PAYS DE L ARBRESLE',
                company_naf_code: '8411Z',
                intra_vat: 'FR90246900625',
                address_street: '117 RUE PIERRE PASSEMARD',
                address_city: "L'ARBRESLE",
                address_postcode: '69210',
              });
            },
            fetchCompany(siret: string): Observable<Partial<CompanyV2>> {
              return of({
                _id: 4,
                siret: '24690062500012',
                siren: null,
                legal_name: 'COMMUNAUTE COMMUNES PAYS DE L ARBRESLE',
                company_naf_code: '8411Z',
                intra_vat: 'FR90246900625',
                address_street: '117 RUE PIERRE PASSEMARD',
                address_city: "L'ARBRESLE",
                address_postcode: '69210',
              });
            },
          },
        },
        {
          provide: ToastrService,
          useValue: {
            success: () => {},
          },
        },
        {
          provide: TerritoryApiService,
          useValue: territoryApiServiceSpy,
        },
        {
          provide: AuthenticationService,
          useValue: {
            get user$(): Observable<User> {
              return new Observable((subscriber) => {
                subscriber.next(new User({ group: Groups.Registry }));
              });
            },
            hasRole(role: Roles | Roles[], user: User): boolean {
              const roles = Array.isArray(role) ? role : [role];
              if (!user) return false;
              return roles.indexOf(user.role) > -1;
            },
          },
        },
        { provide: TerritoryStoreService, useValue: {} },
      ],
    }).compileComponents(),
  );

  it('should load empty form when new territory', async () => {
    // Arrange
    const fixture = TestBed.createComponent(TerritoryFormComponent);
    const comp = fixture.componentInstance;
    // Assert
    expect(comp).toBeTruthy();
    fixture.detectChanges();
    await fixture.whenStable().then(() => {
      expect(comp.territoryForm.get('name').value).toEqual('');
      expect(comp.territoryForm.get('address').get('street').value).toBeUndefined();
      expect(comp.territoryForm.get('address').get('city').value).toBeUndefined();
      expect(comp.territoryForm.get('address').get('postcode').value).toBeUndefined();
      expect(comp.territoryForm.get('company').get('siret').value).toEqual('');
      expect(comp.territoryForm.get('contacts').get('gdpr_dpo').get('email').value).toBeUndefined('');
      expect(comp.territoryForm.get('contacts').get('gdpr_controller').get('email').value).toBeUndefined();
      expect(comp.territoryForm.get('contacts').get('technical').get('email').value).toBeUndefined();
    });
  });

  // TODO: merge with previous test
  it('should submit new territory form', async () => {
    // Arrange
    const fixture = TestBed.createComponent(TerritoryFormComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();

    // Act
    const fb: FormBuilder = new FormBuilder();
    comp.territoryForm = fb.group({
      name: ["Communauté de communes du Pays de L'Arbresle"],
      inseeString: [
        '69010,69021,69022,69032,69057,69067,69076,69083,69086,69112,69171,69208,69216,69231,69173,69175,69177',
      ],
      address: fb.group(
        new FormAddress(
          new Address({
            street: null,
            city: null,
            country: null,
            postcode: null,
          }),
        ),
      ),
      company: fb.group(new FormCompany({ siret: '246 900 625 00012', company: new Company() })),
      contacts: fb.group({
        gdpr_dpo: fb.group(new FormContact(new Contact({ firstname: null, lastname: null, email: null }))),
        gdpr_controller: fb.group(
          new FormContact(
            new Contact({
              firstname: null,
              lastname: null,
              email: null,
            }),
          ),
        ),
        technical: fb.group(new FormContact(new Contact({ firstname: null, lastname: null, email: null }))),
      }),
    });

    // detect siret change
    // comp.territoryForm.controls.company.get('siret').mar
    // tick(400);
    comp.territoryForm.updateValueAndValidity();
    comp.territoryForm.controls.company.get('siret').setValue('24690062500012');
    comp.territoryForm.controls.company.markAsDirty();
    comp.territoryForm.controls.company.markAllAsTouched();
    comp.territoryForm.controls.company.updateValueAndValidity({
      onlySelf: true,
      emitEvent: true,
    });
    // console.debug(fixture.debugElement);
    // const siretInput = fixture.debugElement.query(By.css('[data-testid="company-siret"]'));
    // console.debug(siretInput);
    // siretInput.triggerEventHandler('blur', null);
    // siretInput.nativeElement.blur();
    // flush();
    fixture.detectChanges();
    comp.territoryForm.controls.company.get('siret').setValue('24690062500012');
    await new Promise((resolve) => setTimeout(resolve, 300));
    fixture.detectChanges();
    comp.territoryForm.controls.company.get('siret').setValue('24690062500012');
    comp.territoryForm.controls.inseeString.setValue('69010,69021');
    fixture.detectChanges();

    console.debug(`form -> ${comp.territoryForm.controls.company.get('siret').value}`);

    await fixture.whenStable().then(async () => {
      comp.onSubmit();

      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Assert
      expect(territoryApiServiceSpy.createNew).toHaveBeenCalled();
    });

    // expect(territoryApiServiceSpy.createNew).toHaveBeenCalledWith({
    //   level: TerritoryLevelEnum.Towngroup,
    //   name: "Communauté de communes du Pays de L'Arbresle",
    //   company_id: 3,
    //   children: [1, 2],
    //   address: {
    //     street: '',
    //     postcode: '',
    //     city: '',
    //     country: '',
    //   },
    // });

    // await fixture.whenStable().then(() => {});
  });

  it('should load existing territory with company if exists', async () => {
    // Arrange
    const fixture = TestBed.createComponent(TerritoryFormComponent);
    const comp = fixture.componentInstance;

    const baseTerritory: TerritoryBase = {
      _id: 1,
      name: "Communauté de communes du Pays de L'Arbresle",
      level: TerritoryLevelEnum.Towngroup,
      address: { street: undefined, postcode: undefined, city: undefined, country: undefined },
      contacts: new Contacts({
        gdpr_dpo: new Contact({ firstname: '', lastname: '', email: 'gdpr_dpo@mail.com' }),
        gdpr_controller: new Contact({ firstname: '', lastname: '', email: 'gdpr_controller@mail.com' }),
        technical: new Contact({ firstname: '', lastname: '', email: 'technical@mail.com' }),
      }),
      children: [],
      company_id: 2,
    };
    const territory: Territory = new Territory(null);

    comp.territory = new Territory(territory.map(baseTerritory));
    fixture.detectChanges();

    // Assert
    await fixture.whenStable().then(() => {
      expect(comp.territoryForm.get('name').value).toEqual("Communauté de communes du Pays de L'Arbresle");

      // contacts email
      expect(comp.territoryForm.get('contacts').get('gdpr_dpo').get('email').value).toEqual('gdpr_dpo@mail.com');
      expect(comp.territoryForm.get('contacts').get('gdpr_controller').get('email').value).toEqual(
        'gdpr_controller@mail.com',
      );
      expect(comp.territoryForm.get('contacts').get('technical').get('email').value).toEqual('technical@mail.com');

      // company
      expect(comp.territoryForm.get('company').get('siret').value).toEqual('24690062500012');

      // company address
      expect(comp.territoryForm.get('address').get('street').value).toEqual('117 RUE PIERRE PASSEMARD');
      expect(comp.territoryForm.get('address').get('city').value).toEqual("L'ARBRESLE");
      expect(comp.territoryForm.get('address').get('postcode').value).toEqual('69210');
    });
  });
});
