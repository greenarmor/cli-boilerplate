import { ComponentFixture, TestBed } from '@angular/core/testing';
import { __NAME__Component } from '../components/__NAME__/__NAME__.component';

describe('__NAME__Component', () => {
  let component: __NAME__Component;
  let fixture: ComponentFixture<__NAME__Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [__NAME__Component]
    });

    fixture = TestBed.createComponent(__NAME__Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
