import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService, untilDestroyed } from '@app/core';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  login() {
    // this needs to return something on the backend that says whether or not login was a success
    // and this postCreds needs to be in the login function somehow
    this.postCreds(this.loginForm.value.username, this.loginForm.value.password);
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  /**
   * Send login info to backend
   * maybe make a hash for now with creds, will do security update next
   * going look into where to create loginService
   */
  postCreds(username: string, password: string) {
    console.log('in postCred1 with uname: ' + username + 'and pw: ' + password);
    this.authenticationService.postCreds(username, password).subscribe(
      (id: any) => {
        console.log('created id of message: ', id);

        this.isLoading = true;
        const login$ = this.authenticationService.login(this.loginForm.value);
        login$
          .pipe(
            finalize(() => {
              this.loginForm.markAsPristine();
              this.isLoading = false;
            }),
            untilDestroyed(this)
          )
          .subscribe(
            credentials => {
              // basic auth and jwt
              // if not logged in stay on loggin page if logged in do redirect
              // add if statement that checks if we got logged in by the backend
              // can probably just hardcode for now
              log.debug(`${credentials.username} successfully logged in`);
              // we will assign boolean from login to flag
              const flag = true; // isAuthenticated from credentials.service either include or need getter from auth
              // call a function that sees whether or not the user gets logged in, will need to pass in user info
              // do a
              if (flag) {
                this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
              } else {
                this.router.navigate([this.route.snapshot.queryParams.redirect || '/login'], { replaceUrl: true });
              }
            },
            error => {
              log.debug(`Login error: ${error}`);
              this.error = error;
            }
          );
      },
      error => {
        console.log('err', error);
      }
    );
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  /**
   * Setup validators for login info
   * This should be checked before the user logs in
   */
  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(13)]],
      password: ['', Validators.required],
      // flag to remmeber login so username and token is stored in localStorage.
      // if false saves to sessionStorage
      remember: true
    });
  }
}
