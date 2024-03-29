import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registerForm!: FormGroup;
  version: string | null = environment.version;
  error: string | undefined;
  isLoading = false;
  submitted = false;
  errorType = '';
  toastMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: this.MustMatch('password', 'confirmPassword')
      }
    );
  }

  showToaster(message: string) {
    this.toastr.success(message);
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    console.log('submitting');
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log('invalid form');
      return;
    }
    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));

    // here we can send info to backend to be created
    this.createUser(
      this.registerForm.value.email,
      this.registerForm.value.username,
      this.registerForm.value.password
    ).subscribe(
      success => {
        this.showToaster('User creation successful!');
        console.log(success);
        this.router.navigate([this.route.snapshot.queryParams.redirect || '/login'], { replaceUrl: true });
        console.log('navigate back to login page after login created');
      },
      error => {
        this.submitted = false;
        this.errorType = error.error.result;
        if (this.errorType === 'unique_violation') {
          this.toastMessage = 'Username taken. Please try again.';
        } else {
          this.toastMessage = 'Could not create user. Database error.';
        }
        this.showToaster(this.toastMessage);
        console.log('create user fail = ' + error);
      }
    );
    // after we send info to backend we can redirect to login
  }

  createUser(email: string, username: string, password: string): Observable<any> {
    console.log('in register user');
    console.log(email);
    console.log(username);
    console.log(password);
    return this.httpClient.post('/register', {
      email,
      username,
      password
    });
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  goToLogin() {
    this.router.navigate([this.route.snapshot.queryParams.redirect || '/login'], { replaceUrl: true });
  }

  private MustMatch(controlName: string, matchingControlName: string) {
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
    };
  }
}
