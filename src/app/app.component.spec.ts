import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let formBuilder: FormBuilder;
  let form: FormGroup;
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatInputModule,
        MatFormFieldModule,
        MatChipsModule,
        MatToolbarModule,
        MatIconModule,
        MatDatepickerModule,
        MatRadioModule,
        MatNativeDateModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should add new row', () => {
    component.addNewRow();
    const control = component.userForm.get('userRow') as FormArray;
    expect(control?.length).toBe(1);
  });

  it('should enable form controls for editing', () => {
    component.addNewRow();
    component.editTableData();
    const formArray = component.userForm.get('userRow') as FormArray;
    const formGroup = formArray.controls[0] as FormGroup;
      for (const controlName in formGroup.controls) {
        const control = formGroup.controls[controlName];
        expect(control.enabled).toBe(true);
      }
    
  });

  it('Should delete the row when user click on delete icon', () => {
    component.addNewRow();
    component.addNewRow();
    component.deleteRow(0);
    expect(component.userDataSource.data.length).toEqual(1);
  });

  it('Should call onSubmit', () => {
    component.addNewRow();
    const formArray = component.userForm.get('userRow') as FormArray;
    const formGroup = formArray.controls[0] as FormGroup;
    formGroup.setValue({
      position: 0,
      username: 'John',
      age: '21',
      dob: '1/08/2023',
      mobileno: [9876543210],
      mobileHelper: '',
      address: 'abc street',
      email: 'john@mail.com',
      gender: 'male'
    });
    component.onSubmit();
    expect(component.isFormSubmitted).toBeTrue();
    
  })

  it('should initialize user form', () => {
    const form = component.userFormInitiate(0);
    expect(form.get('position')).toBeTruthy();
  });

  it('Should call mobileNoValidation', () => {
    const mobileno = '9090909090';
    const spy = spyOn(component, 'mobileNoValidation').and.callThrough();
    component.mobileNoValidation(mobileno);
    expect(spy).toHaveBeenCalled();
  });

  it('should add valid mobile number to form control', () => {
    const validMobileNo = '1234567890';
    const event: MatChipInputEvent = {
      value: validMobileNo,
    } as MatChipInputEvent;
    const formControl: AbstractControl = new FormControl([]);
    const helperForm: AbstractControl = new FormControl('');

    component.addMobileNo(event, {
      get: (key: any) => {
        if (key === 'mobileno') return formControl;
        if (key === 'mobileHelper') return helperForm;
        return null;
      },
    });

    expect(formControl.value).toEqual([validMobileNo]);
    expect(formControl.hasError('incorrectMobile')).toBe(false);
    expect(helperForm.value).toBe('');
  });

  it('should remove selected mobile number from the form control', () => {
    const selectedMobile = '1234567890';
    const formGroup: FormGroup = new FormGroup({
      mobileno: new FormControl(['1234567890', '9876543210']),
    });
    component.removeMobileNo(selectedMobile, formGroup);
    const formControl = formGroup.get('mobileno');
    expect(formControl?.value).toEqual(['9876543210']);
  });

  it('should set incorrectMobile error if no mobile numbers are left after removal', () => {
    const selectedMobile = '1234567890';
    const formGroup: FormGroup = new FormGroup({
      mobileno: new FormControl(['1234567890'], Validators.required),
    });
    component.removeMobileNo(selectedMobile, formGroup);
    const formControl = formGroup.get('mobileno');
    expect(formControl?.errors).toEqual({ incorrectMobile: true });
  });

  it('should return false for mobile number with less than 10 digits', () => {
    const mobileNumber = '123456789'; // 9 digits
    const isValid = component.mobileNoValidation(mobileNumber);
    expect(isValid).toBe(false);
  });

  it('Should call addNewRow when click in ADD button', () => {
    const addbtn = fixture.debugElement.query(By.css('.addbtn'));
    addbtn.triggerEventHandler('click', null);
    component.userFormInitiate(1);
    expect(component.userDataSource.data.length).toEqual(1);
  });
  
});
