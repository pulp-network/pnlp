import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Logger } from '@core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IdentityService } from './identity.service';

const log = new Logger('AuthenticationGuard');

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router, private identityService: IdentityService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.identityService.observableIdentity.pipe(
      map((i) => {
        if (!!i) {
          return true;
        } else {
          log.debug('Not authenticated, redirecting to sign-in url with redirect params...');
          this.router.navigate(['/sign-in'], { queryParams: { redirect: state.url }, replaceUrl: true });
          return false;
        }
      })
    );
  }
}
