import { Component } from '@angular/core';

import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { DataService } from '../../services/data.service';
import { customFields } from '../../mocks/custom-fields';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    FormsModule,
    InputTextareaModule,
    DropdownModule,
    CardModule,
    InputMaskModule,
    CalendarModule,
    InputTextModule,
    ReactiveFormsModule,
    TooltipModule,
    CommonModule,
  ],
  providers: [DataService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  technicians: any = [];
  areas: any = [];
  jobSources: any = [];
  jobs: any = [];

  form: FormGroup;
  fields: any[] = [];
  stages: any;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postCode: ['', Validators.required],
      jobArea: [null, Validators.required],
      jobType: [null, Validators.required],
      technician: [null, Validators.required],
      jobSource: [null, Validators.required],
      jobDate: [null, Validators.required],
      jobStartTime: [null, Validators.required],
      jobEndTime: [null, Validators.required],
      jobDescription: [''],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData(): void {
    this.dataService.getStages(1).subscribe((data) => {
      this.stages = data;
    });

    this.dataService.getDealFields().subscribe((data) => {
      this.fields = data;
      data.forEach((field) => {
        switch (field.name) {
          case customFields.technician:
            this.technicians = field.options;
            this.form.patchValue({
              technician: this.technicians[0],
            });
            break;
          case customFields.jobType:
            this.jobs = field.options;
            this.form.patchValue({
              jobType: this.jobs[0],
            });
            break;
          case customFields.jobSource:
            this.jobSources = field.options;
            this.form.patchValue({
              jobSource: this.jobSources[0],
            });
            break;
          case customFields.jobArea:
            this.areas = field.options;
            this.form.patchValue({
              jobArea: this.areas[0],
            });
            break;
          default:
            break;
        }
      });
    });
  }
  private formPayload() {
    const stageId = this.stages.find(
      (stage: { name: string; id: number }) => stage.name === 'Submitted'
    )?.id;

    if (!stageId) {
      return;
    }

    const payload: { [key: string]: any } = {
      title: `JOB #${Date.now()}`,
      stage_id: stageId,
    };

    const reversedObject = Object.fromEntries(
      Object.entries(customFields).map(([key, value]) => [value, key])
    );

    const formData = this.form.value;

    this.fields.forEach((field) => {
      const key = reversedObject[field.name];

      if (key) {
        const getAddress = () => {
          const { address, city, state, postCode } = formData;
          return [address, city, state, postCode].filter(Boolean).join(', ');
        };

        let value =
          field.name === customFields.address ? getAddress() : formData[key];

        payload[field.key] = value?.label || value;
      }
    });

    return payload;
  }

  async onSubmit() {
    if (this.form.valid) {
      const payload = this.formPayload();
      this.dataService.createDeal(payload).subscribe((response) => {
        this.router.navigate(['finished'], {
          queryParams: { id: (response as any).data.id },
        });
      });
    } else {
      for (const controlName in this.form.controls) {
        const control = this.form.get(controlName);
        if (control && control.invalid) {
          control.markAsTouched();
          const nativeElement = document.getElementById(controlName);
          if (nativeElement) {
            nativeElement.focus();
            break;
          }
        }
      }
    }
  }
}
