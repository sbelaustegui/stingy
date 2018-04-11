import {AbstractControl} from '@angular/forms';

export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value;
    let confirmPassword = AC.get('confirmPassword').value;
    if(password != confirmPassword) {
      AC.get('confirmPassword').setErrors( {MatchPassword: true} )
    } else {
      return null
    }
  }

}

export class EmailValidation {

  static MatchEmail(AC: AbstractControl) {
    let password = AC.get('email').value;
    let confirmPassword = AC.get('confirmEmail').value;
    if(password != confirmPassword) {
      AC.get('confirmEmail').setErrors( {MatchEmail: true} )
    } else {
      return null
    }
  }

}
