import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit {
  tabDropdownControl = new FormControl('');
  tabDropdownList: string[] = ['Center', 'Language', 'Residential State', 'Agreement State'];
  printResult: any = [];

  tabData = [
    {
      tabname: 'Center',
      checkboxList: [
        { name: 'Center 1', checked: false },
        { name: 'Center 2', checked: false },
      ],
    },
    {
      tabname: 'Language',
      checkboxList: [
        { name: 'English', checked: false },
        { name: 'Spenish', checked: false },
      ],
    },
    {
      tabname: 'Residential State',
      checkboxList: [
        { name: 'Karnataka', checked: false },
        { name: 'Maharashtra', checked: false },
      ],
    },
    {
      tabname: 'Agreement State',
      checkboxList: [
        { name: 'Aprroved', checked: false },
        { name: 'Not Approved', checked: false },
      ],
    },
  ];

  finalData: any = [];

  // Create a FormGroup and FormArray to manage the form controls
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      tabs: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    console.log('original tab data: ', this.tabData);
  }

  createFormForSelectedTab(tabData: any) {
    tabData.forEach((tab: any) => {
      const checkboxControls = tab.checkboxList.map((checkbox: any) =>
        this.formBuilder.control(checkbox.checked)
      );

      const arr = this.form.get('tabs') as FormArray;
      arr.push(
        this.formBuilder.group({
          tabname: tab.tabname,
          checkboxes: this.formBuilder.array(checkboxControls),
        })
      );
    });
  }

  getFormControl(name: any) {
    const arr = this.form.get(name) as FormArray;
    return arr.controls;
  }

  getCheckbox(fg: any, name: string) {
    const fbb = fg.get(name) as FormArray;
    return fbb.controls;
  }

  getTabName(tab: any) {
    return tab.get('tabname').value;
  }

  onTabSelect(event: any) {
    this.finalData = [];
    const arr = this.form.get('tabs') as FormArray;
    arr.clear();
    event.value.forEach((element: any) => {
      this.tabData.filter((obj: any) => {
        if (obj.tabname === element) {
          this.finalData.push(obj);
        }
      });
    });

    this.createFormForSelectedTab(this.finalData);
  }

  printFinalResult: any = [];
  onSubmit() {
    const obj: any = {};
    const formTabsArray = this.form.get('tabs') as FormArray;

    formTabsArray.controls.forEach((tabControl: any, tabindex) => {
      const checkBoxControls = tabControl.get('checkboxes') as FormArray;
      obj['tabname'] = tabControl.get('tabname').value;
      checkBoxControls.controls.forEach((checkBoxControl: any, checkboxindex) => {
        if (checkBoxControl.value) {
          const checkboxData = this.finalData[tabindex].checkboxList[checkboxindex];
          obj['SelectedCheckboxes'] = checkboxData;
          this.printFinalResult.push(obj);
        }
      })
    });
    console.log('final object: ', this.printFinalResult);
  }
}