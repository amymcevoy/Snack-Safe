import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllergySetupPage } from './allergy-setup.page';

describe('AllergySetupPage', () => {
  let component: AllergySetupPage;
  let fixture: ComponentFixture<AllergySetupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllergySetupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
