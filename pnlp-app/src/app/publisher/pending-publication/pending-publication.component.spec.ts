import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPublicationComponent } from './pending-publication.component';

describe('PendingPublicationComponent', () => {
  let component: PendingPublicationComponent;
  let fixture: ComponentFixture<PendingPublicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PendingPublicationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
