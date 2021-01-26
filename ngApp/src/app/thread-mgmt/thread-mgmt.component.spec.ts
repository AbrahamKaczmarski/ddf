import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadMgmtComponent } from './thread-mgmt.component';

describe('ThreadMgmtComponent', () => {
  let component: ThreadMgmtComponent;
  let fixture: ComponentFixture<ThreadMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadMgmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
