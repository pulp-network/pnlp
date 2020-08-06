// Validators that return a string
export interface ValidatorFnc<T> {
  (subject: T): string;
}

export class Validator {
  public static throwIfInvalid<T>(subject: T, fnc: ValidatorFnc<T>): void {
    const err = fnc(subject);
    if (err && err.length) {
      throw new Error(err);
    }
  }
}
