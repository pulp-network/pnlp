import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@app/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuHidden = true;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {}

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  logout() {
    this.userService.logout().subscribe(() => this.router.navigate([''], { replaceUrl: true }));
  }

  get userAddress(): Observable<string> | null {
    return this.userService.userAddress();
  }

  get isAuthenticated() {
    return this.userService.isAuthenticated();
  }
}
