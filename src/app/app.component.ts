import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  @ViewChild(MatTable) table!: MatTable<any>;

  title = 'userApp';
  userData = [];
  displayedColumns: string[] = ['position', 'username', 'age', 'dob', 'mobileno', 'address', 'email', 'gender', 'action'];
  userDataSource = new MatTableDataSource<any>();
  userForm!: FormGroup;
  currentRowIndex: number = 0;
  isFormSubmitted = false;
  isEditMode = false;
  eachRowFormcontrol: any
  public readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emailList = [];
  constructor(private _fb: FormBuilder, private _formBuilder: FormBuilder) {}

  /**
   * Angular Life cycle hook method
   */
  ngOnInit() {
    this.userForm = this._formBuilder.group({
      userRow: this._formBuilder.array([])
    });
    if (this.userDataSource.data.length > 0) {
      this.userForm = this._fb.group({
        VORows: this._fb.array(this.userDataSource.data.map(val => this._fb.group({
          position: new FormControl(val.position),
          name: new FormControl(val.username, Validators.required),
          age: new FormControl(val.age, Validators.required),
          dob: new FormControl(val.dob, Validators.required),
          mobileno: new FormControl([]),
          address: new FormControl(val.address, Validators.required),
          email: new FormControl(val.email, [Validators.required, Validators.email]),
          gender: new FormControl(val.gender, Validators.required)
        })
        )) //end of fb array
      }); // end of form group cretation
    }
    
  }

  /**
   * new row added with empty form fields in Table
   */
  addNewRow() {
    this.currentRowIndex = this.currentRowIndex + 1;
    const control = this.userForm.get('userRow') as FormArray;
    control.insert(control.length, this.userFormInitiate(this.currentRowIndex));
    this.userDataSource = new MatTableDataSource(control.controls);
  }

  /**
   * empty form initiate when user click on ADD button
   * @returns
   */
  userFormInitiate(rowIndex: number) {
    return this._fb.group({
      position: new FormControl(rowIndex),
      username: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      mobileno: new FormControl([], [Validators.required, Validators.minLength(10)]),
      mobileHelper: new FormControl(null),
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
    // console.log('user data source: ', this.userDataSource.data);
    this.userDataSource.data.splice(index, 1);
    // console.log('after delete: ', this.userDataSource);
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
  EditTableData() {
    this.isEditMode = true;
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
    if (helperForm.valid) {
      if (value) {
        formControl.setValue([...formControl.value, value]);
       // formControl.setErrors({'incorrectMobile': false});
      } else {
        // formControl.setErrors({'incorrectMobile': true});
      }
      helperForm.setValue('');
  } 
}
   removeMobileNo(selectedEmail: string, element: any): void {
    const formControl: AbstractControl = element.get('mobileno');
    const mobileNoList = formControl.value;
    const index = mobileNoList.indexOf(selectedEmail);
    mobileNoList.splice(index, 1);
  }

  // mobileNoValidation(mobileno: any) {
  //   if (mobileno.length < 10) {
  //     return false;
  //   }
  //   return true;
  // }

}
