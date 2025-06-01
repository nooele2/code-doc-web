import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProfileComponent } from '../component/profile/profile.component';
import { HistoryComponent } from '../component/history/history.component';

@Component({
  selector: 'app-code-processor',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileComponent, HistoryComponent],
  templateUrl: './code-processor.component.html',
})
export class CodeProcessorComponent {
  sidebarOpen = true;
  codeSnippet = '';
  apiKey = '';
  apiKeyType = 'OpenAI';
  detailLevel = 'Basic';
  featureType = 'Comments';
  documentationFile: File | null = null;
  result = '';
  error = '';
  loading = false;
  showHistory = false;
  history: { code: string; response: string; name?: string; editing?: boolean }[] = [];
  useDefaultDoc = true;

  constructor(private http: HttpClient) {}

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
  }

  loadFromHistory(item: { code: string; response: string }) {
    this.codeSnippet = item.code;
    this.result = item.response;
    this.error = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.documentationFile = input.files[0];
      this.useDefaultDoc = false;
      this.error = '';
    }
  }

  deleteFile(): void {
    this.documentationFile = null;
    this.useDefaultDoc = true;
    this.error = '';

    const fileInput = document.getElementById('documentationFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.apiKey || !this.codeSnippet) {
      this.error = 'Please enter your API key and code snippet.';
      return;
    }

    this.error = '';
    this.loading = true;
    this.result = '';

    const formData = new FormData();

    // Use user-uploaded file or fetch default file
    if (this.useDefaultDoc) {
      formData.append('useDefaultDoc', 'true');
    } else if (this.documentationFile) {
      formData.append('file', this.documentationFile, this.documentationFile.name);
    } else {
      try {
        const response = await fetch('resources/default_documentation.pdf');
        if (!response.ok) throw new Error('Failed to fetch default documentation file.');
        const blob = await response.blob();
        const defaultFile = new File([blob], 'default_documentation.pdf', { type: blob.type });
        formData.append('file', defaultFile, defaultFile.name);
        console.log('Using default documentation file.');
      } catch (err) {
        this.error = 'Failed to load default documentation file.';
        this.loading = false;
        return;
      }
    }

    // Append other form fields
    formData.append('prompt', this.codeSnippet);
    formData.append('apiKey', this.apiKey);
    formData.append('apiKeyType', this.apiKeyType);
    formData.append('detailLevel', this.detailLevel);
    formData.append('featureType', this.featureType);

    // Send to backend
    this.http.post<any>('https://backend-vs-plug-in.onrender.com/api/chat', formData).subscribe({
      next: (response) => {
        if (response?.response) {
          this.result = response.response;
          this.history.unshift({
            code: this.codeSnippet,
            response: response.response,
            name: `Snippet ${this.history.length + 1}`,
          });
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
