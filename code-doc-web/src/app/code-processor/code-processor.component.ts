import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-code-processor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './code-processor.component.html',
})
export class CodeProcessorComponent {
  codeSnippet: string = '';
  apiKey: string = '';
  apiKeyType: string = 'OpenAI';
  detailLevel: string = 'Basic';
  featureType: string = 'Comments';
  documentationFile: File | null = null;
  result: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.documentationFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.documentationFile) {
      this.error = 'Please upload a documentation file.';
      return;
    }
    if (!this.apiKey) {
      this.error = 'Please enter your API key.';
      return;
    }
    if (!this.codeSnippet) {
      this.error = 'Please enter a code snippet.';
      return;
    }

    this.error = '';
    this.loading = true;
    this.result = '';

    const formData = new FormData();
    formData.append('file', this.documentationFile, this.documentationFile.name);
    formData.append('prompt', this.codeSnippet);
    formData.append('apiKey', this.apiKey);
    formData.append('apiKeyType', this.apiKeyType);
    formData.append('detailLevel', this.detailLevel);
    formData.append('featureType', this.featureType);

    this.http.post<any>('https://backend-vs-plug-in.onrender.com/api/chat', formData).subscribe({
      next: (response) => {
        if (response?.response) {
          this.result = response.response;
        } else {
          this.error = 'No response from backend.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'An error occurred.';
        this.loading = false;
      },
    });
  }
}
