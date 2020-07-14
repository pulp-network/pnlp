import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  body: string;
  mode: {};
  options: {};

  constructor() {}

  ngOnInit(): void {}
}
