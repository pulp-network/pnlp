import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationListComponent } from './publication-list.component';

describe('PublicationListComponent', () => {
  let component: PublicationListComponent;
  let fixture: ComponentFixture<PublicationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublicationListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
