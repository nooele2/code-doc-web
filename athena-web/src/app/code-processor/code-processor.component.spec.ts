import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeProcessorComponent } from './code-processor.component';

describe('CodeProcessorComponent', () => {
  let component: CodeProcessorComponent;
  let fixture: ComponentFixture<CodeProcessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeProcessorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
