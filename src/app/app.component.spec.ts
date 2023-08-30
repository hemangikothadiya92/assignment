import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
        MatIconModule,
        MatToolbarModule,
        MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    MatChipsModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    formBuilder = new FormBuilder();
    form = formBuilder.group({
      userRow: formBuilder.array([]),
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize empty userRow', () => {
    component.ngOnInit();
    const itemsArray = form.get('userRow') as FormArray;
    expect(itemsArray.length).toBe(0);
  });

  
  it('should add a new item to the form array', () => {
    const rowsArray = form.get('userRow') as FormArray;
    rowsArray.insert(rowsArray.length, component.userFormInitiate(1));
    expect(rowsArray.length).toBe(1);
  });

  it('should add row in table', () => {
    const rowsArray = form.get('userRow') as FormArray;
    rowsArray.insert(rowsArray.length, component.userFormInitiate(1));
    component.userDataSource = new MatTableDataSource(rowsArray.controls);
    expect(component.userDataSource.data.length).toEqual(1);
    
  });

  it('check login form is valid or not', () => {
    const ELEMENT_DATA = [
      {
        position: 1,
        username: 'Hydrogen',
        age: '21',
        dob: '09/01/2023',
        mobileno: ['0000000000'],
        mobileHelper: '999',
        address: 'abs street',
        email: 'abc@mail.com',
        gender: 'male',
      },
      {
        position: 2,
        username: 'Hydrogen',
        age: '21',
        dob: '09/01/2023',
        mobileno: ['0000000000'],
        mobileHelper: '',
        address: 'abs street',
        email: 'abc@mail.com',
        gender: 'male',
      },
    ];
    const userform = form.get('userRow') as FormArray;
    userform.insert(userform.length, component.userFormInitiate(1));
    userform.controls[0].setValue({
      position: 1,
      username: 'Hydrogen',
      age: '21',
      dob: '09/01/2023',
      mobileno: ['0000000000'],
      mobileHelper: '',
      address: 'abs street',
      email: 'abc@mail.com',
      gender: 'male',
    });
    const isUserFormValid = userform.valid;
    expect(isUserFormValid).toBeTruthy();
  });

  it('should deleteRow call', fakeAsync(() => {
    const index = 0;
    const dummyFormData: FormGroup = formBuilder.group({
      position: new FormControl(1),
      username: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      mobileno: new FormControl([]),
      mobileHelper: new FormControl(),
      address: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      gender: new FormControl('', Validators.required),
    });
    const dummyFormData1: FormGroup = formBuilder.group({
      position: new FormControl(1),
      username: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      mobileno: new FormControl([]),
      mobileHelper: new FormControl(),
      address: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      gender: new FormControl('', Validators.required),
    });
    component.userDataSource.data.push(dummyFormData);
    component.userDataSource.data.push(dummyFormData1);
    console.log('data source: ', component.userDataSource.data);
    const deleteSpy = spyOn(component, 'deleteRow').and.callThrough();
    const initialRowCount = component.userDataSource.data.length;
    component.userDataSource.data.splice(index, 1);
    fixture.detectChanges();
    component.deleteRow(0);
    const finalRowCount = component.userDataSource.data.length;
    expect(deleteSpy).toHaveBeenCalledWith(0);
  }));

  it('Should call mobileNoValidation', () => {
    const mobileno = '9090909090';
    const spy = spyOn(component, 'mobileNoValidation').and.callThrough();
    component.mobileNoValidation(mobileno);
    expect(spy).toHaveBeenCalled();
  });

  it('Should call addNewRow', () => {
    const control = form.get('userRow') as FormArray;
    const addNewRowSpy = spyOn(component, 'addNewRow').and.callThrough();
    component.addNewRow();
    expect(addNewRowSpy).toHaveBeenCalled();
  });
  
  it('should call onSubmit method when Submit button is clicked', () => {
    
    const userform = form.get('userRow') as FormArray;
    userform.insert(userform.length, component.userFormInitiate(1));
    userform.controls[0].setValue({
      position: 1,
      username: 'Hydrogen',
      age: '21',
      dob: '09/01/2023',
      mobileno: ['0000000000'],
      mobileHelper: '',
      address: 'abs street',
      email: 'abc@mail.com',
      gender: 'male',
    });
    const isUserFormValid = userform.valid;
    console.log('is form valid: ', isUserFormValid);
    const spy = spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit();
    expect(component.isFormSubmitted).toBe(true);
    expect(component.onSubmit).toHaveBeenCalled();
  });

   it('should userForm validate', () => {
    const rowsArray = form.get('userRow') as FormArray;
    rowsArray.insert(rowsArray.length, component.userFormInitiate(1));
    component.userDataSource = new MatTableDataSource(rowsArray.controls);
   // console.log(component.userDataSource.data[0]);
    const input = component.userDataSource.data[0].get('username');
    input.value = 'john';
    expect(form.valid).toBeFalsy();
  });

  it('Should call editTableData', () => {
    component.userForm = new FormGroup({
      userRow: new FormArray([
        new FormGroup({
      position: new FormControl(1),
      username: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      mobileno: new FormControl([]),
      mobileHelper: new FormControl(),
      address: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      gender: new FormControl('', Validators.required),
        })
      ]),
    });
    component.editTableData();
    expect(component.isEditMode).toBe(true);
    expect(component.isFormSubmitted).toBe(true);

    const control = component.userForm.get('userRow') as FormArray;
    for (let i = 0; i < control.length; i++) {
      const group = control.at(i) as FormGroup;
      const isEnabled = group.enabled;
      expect(isEnabled).toBe(true);
    }
  });

  it('Should call addMobileNo', () => {
    const event: MatChipInputEvent = { value: '1234567890' } as MatChipInputEvent;
    const formGroup: FormGroup = new FormGroup({
      mobileno: new FormControl([]),
      mobileHelper: new FormControl('', [Validators.required]),
    });
    console.log('form group:', formGroup);
    const spy1 = spyOn(component, 'mobileNoValidation').and.callThrough();
    component.addMobileNo(event, formGroup);
    expect(spy1).toHaveBeenCalled();
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
  
});
