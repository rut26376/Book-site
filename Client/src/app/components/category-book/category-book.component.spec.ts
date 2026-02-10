import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryBookComponent } from './category-book.component';

describe('CategoryBookComponent', () => {
  let component: CategoryBookComponent;
  let fixture: ComponentFixture<CategoryBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryBookComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
