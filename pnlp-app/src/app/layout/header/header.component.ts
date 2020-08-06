import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@app/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IdentityService, PnlpIdentity } from '../../@core/identity/identity.service';
import { PreferencesService } from '../../@core/preferences/preferences.service';
import { PublicationService } from '../../@core/publication/publication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuHidden = true;
  observableIdentity$: Observable<PnlpIdentity>;
  ethAddress$: Observable<string>;
  myPublications$: Observable<string[]>; //TODO:get publication list on identity load

  constructor(
    private router: Router,
    private userService: UserService,
    private identityService: IdentityService,
    private publicationService: PublicationService,
    private preferencesService: PreferencesService
  ) {}

  get nerdMode$(): Observable<boolean> {
    return this.preferencesService.observablePreferences.pipe(map((p) => p.nerd_mode));
  }

  ngOnInit() {
    // this.identityService.loadEthereumAddress();
    this.observableIdentity$ = this.identityService.observableIdentity;
    this.ethAddress$ = this.observableIdentity$.pipe(
      map((i) => {
        return i?.ethereum_identity?.value;
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

  setNerdMode(mode: boolean) {
    this.preferencesService.setPreference({ nerd_mode: mode });
  }

  get userAddress(): Observable<string> | null {
    return this.userService.userAddress();
  }

  get isAuthenticated() {
    return this.userService.isAuthenticated();
  }
}
