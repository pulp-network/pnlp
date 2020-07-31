import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@app/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IdentityService, PnlpIdentity } from '../../@core/identity/identity.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuHidden = true;
  observableIdentity$: Observable<PnlpIdentity>;
  ethAddress$: Observable<string>;

  constructor(private router: Router, private userService: UserService, private identityService: IdentityService) {}

  ngOnInit() {
    // this.identityService.loadEthereumAddress();
    this.observableIdentity$ = this.identityService.observableIdentity;
    this.ethAddress$ = this.observableIdentity$.pipe(
      map((i) => {
        return i?.ethereum_identity?.value?.toHexString();
      })
    );
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  signin() {
    this.identityService.initalizeIdentity();
  }

  signout() {
    this.identityService.signout();
  }

  get userAddress(): Observable<string> | null {
    return this.userService.userAddress();
  }

  get isAuthenticated() {
    return this.userService.isAuthenticated();
  }
}
