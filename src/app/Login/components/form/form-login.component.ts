import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { loginApi } from 'src/app/shared/services/loginApi.services/loginApi.service';
import { catchError, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'form-component',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css'],
})
export class FormLoginComponent {
  constructor(public login: loginApi) {}
  private destroy$ = new Subject<void>();
  openAlert: boolean = false;
  typeAlert: string = 'danger';
  messageAlert: string = '¡Error, usuario inexistente!';
  startLoader: boolean = false;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startAlert() {
    this.openAlert = true;
    setTimeout(() => {
      this.openAlert = false;
    }, 3500);
  }

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.startLoader = true;
      this.login
        .login(this.loginForm.value)
        .pipe(
          catchError((error) => {
            console.error('Error de servidor o de usuario:', error);
            this.startLoader = false;
            this.startAlert();
            return of(null);
          }),
          takeUntil(this.destroy$)
        )
        .subscribe((data) => {
          this.startLoader = false;
          this.login.addTokenToStorage(data.ATO, data.user.name);
        });
    }
  }
}
