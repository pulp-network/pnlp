import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  get browseAddress() {
    return `https://${environment.etherscanDomain}/address/${environment.contractAddress}`;
  }

  constructor() {}

  ngOnInit() {}
}
