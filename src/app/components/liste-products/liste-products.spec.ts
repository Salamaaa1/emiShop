import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeProducts } from './liste-products';

describe('ListeProducts', () => {
  let component: ListeProducts;
  let fixture: ComponentFixture<ListeProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
