import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Registration } from './app.model';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
@Component({
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {
    age: number;
    date:string;
    registerForm: FormGroup;
    submitted = false;
    data: Map<number, Registration> = new Map<number, Registration>();
    results: Registration[] = [];
    searchTerm$ = new Subject<string>();
    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        var today = new Date(),
        month = '' + (today.getMonth() + 1),
        day = '' + today.getDate(),
        year = today.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    this.date= [year, month, day].join('-');
        this.registerForm = this.formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            dob: ['', [Validators.required]],
            address: ['', [Validators.required]],
            state: ['', [Validators.required]],
            zip: ['', [Validators.required]],
            city: ['', [Validators.required]],
            gender: ['', [Validators.required]],
            adharno: ['', [Validators.required, Validators.minLength(2)]],
            phoneno: ['', [Validators.required, Validators.minLength(10)]],
        }, {
            // validator: this.checkForPostive('age')
        });
    }

    checkForPostive(controlName: string) {
        return (formGroup: FormGroup) => {
            const age = formGroup.controls[controlName];
            if (age.value < 0) {
                age.setErrors({ data: 'Age cannot be negative' })
            }
        }
    }
    mustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // return if another validator has already found an error on the matchingControl
                return;
            }

            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
    }
    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }


    searchEntries(term) {
        this.results = new Array<Registration>();
        this.results.push(this.data.get(term));
    }
    caluculateAge(date: string) {
        if (date) {

            var today = new Date();
            var birthDate = new Date(date);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            this.age = age;
        } else {
            delete this.age;
        }
    }
    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.valid) {
            let formData: Registration = this.registerForm.value;

            if (!this.data.has(formData.adharno)) {
                this.data.set(formData.adharno, formData);
                alert('REGISTRATION SUCCESS')

            } else {
                alert('ADHAR NO EXISTS!!')
            }
        }

    }
}
