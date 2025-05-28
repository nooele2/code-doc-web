import { Component } from '@angular/core';
import { CodeProcessorComponent } from './code-processor/code-processor.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CodeProcessorComponent, HttpClientModule],
  template: '<app-code-processor></app-code-processor>',
})
export class AppComponent {}
