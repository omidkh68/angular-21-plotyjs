import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPlolyjs } from './dashboard-plolyjs';

describe('DashboardPlolyjs', () => {
  let component: DashboardPlolyjs;
  let fixture: ComponentFixture<DashboardPlolyjs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPlolyjs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPlolyjs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
