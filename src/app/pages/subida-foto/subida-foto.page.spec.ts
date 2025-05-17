import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubidaFotoPage } from './subida-foto.page';

describe('SubidaFotoPage', () => {
  let component: SubidaFotoPage;
  let fixture: ComponentFixture<SubidaFotoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubidaFotoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
