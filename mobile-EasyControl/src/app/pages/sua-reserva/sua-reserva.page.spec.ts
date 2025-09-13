import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuaReservaPage } from './sua-reserva.page';

describe('SuaReservaPage', () => {
  let component: SuaReservaPage;
  let fixture: ComponentFixture<SuaReservaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuaReservaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
