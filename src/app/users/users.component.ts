import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<any>;

  userData = [];
  displayedColumns: string[] = [
    'position',
    'username',
    'age',
    'dob',
    'mobileno',
    'address',
    'email',
    'gender',
    'action',
  ];
  userDataSource = new MatTableDataSource<any>();
  userForm!: FormGroup;
  currentRowIndex: number = 0;
  isFormSubmitted = false;
  isEditMode = false;
  eachRowFormcontrol: any;
  public readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(
    private _fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private router: Router
  ) {}

  /**
   * Angular Life cycle hook method
   */
  ngOnInit() {
    this.userForm = this._formBuilder.group({
      userRow: this._formBuilder.array([]),
    });
  }

  goToFilterPage() {
    this.router.navigate(['/filters']);
  }

  /**
   * new row added with empty form fields in Table
   */
  addNewRow() {
    this.currentRowIndex = this.userDataSource.data.length + 1;
    const control = this.userForm.get('userRow') as FormArray;
    control.insert(control.length, this.userFormInitiate(this.currentRowIndex));
    this.userDataSource = new MatTableDataSource(control.controls);
  }

  /**
   * empty form initiate when user click on ADD button
   * @returns form group
   */
  userFormInitiate(currentRowIndex: number) {
    return this._fb.group({
      position: new FormControl(currentRowIndex),
      username: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      mobileno: new FormControl([]),
      mobileHelper: new FormControl(),
      address: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      gender: new FormControl('', Validators.required),
    });
  }

  /**
   * Delete row data based on index
   * @param index
   */
  deleteRow(index: number) {
    this.userDataSource.data.splice(index, 1);
    this.userDataSource.data.forEach((ele: any, index) => {
      ele.controls.position.value = index;
    });
    this.table.renderRows();
  }

  /**
   * Form field is disabled when user submit the form
   */
  onSubmit() {
    if (this.userForm.valid) {
      this.isFormSubmitted = true;
    }
    this.isEditMode = true;
    this.userForm.disable();
  }

  /**
   * User can edit the Table row data
   */
  editTableData() {
    this.isEditMode = true;
    this.isFormSubmitted = true;
    const control = this.userForm.get('userRow') as FormArray;
    control.enable();
  }

  /**
   * User can enter multiple mobile No.
   *
   * @param   {MatChipInputEvent}  event    [MatChip input event]
   * @param   {any}                element  [Form control]
   *
   */
  addMobileNo(event: MatChipInputEvent, element: any): void {
    const formControl: AbstractControl = element.get('mobileno');
    const helperForm: AbstractControl = element.get('mobileHelper');
    const value: string = (event.value || '').trim();
    helperForm.updateValueAndValidity();
    if (helperForm.valid && value) {
      if (this.mobileNoValidation(value)) {
        formControl.setValue([...formControl.value, value]);
        formControl.setErrors({ incorrectMobile: false });
        helperForm.setValue('');
        formControl.updateValueAndValidity();
      } else {
        formControl.setErrors({ incorrectMobile: true });
      }
    } else {
      formControl.setErrors({ incorrectMobile: false });
      formControl.updateValueAndValidity();
    }
  }

  /**
   * Remove mobile no from chips when user click on cross(x)
   * @param selectedEmail
   * @param element
   */
  removeMobileNo(selectedMobileNo: string, element: any): void {
    const formControl: AbstractControl = element.get('mobileno');
    const mobileNoList = formControl.value;
    const index = mobileNoList.indexOf(selectedMobileNo);
    mobileNoList.splice(index, 1);
    if (mobileNoList.length == 0) {
      formControl.setErrors({ incorrectMobile: true });
    } else {
      formControl.updateValueAndValidity();
    }
  }

  /**
   * validate the mobile number
   * @param mobileno mobile no
   * @returns
   */
  mobileNoValidation(mobileno: any) {
    if (mobileno.length < 10) {
      return false;
    }
    return true;
  }
}
