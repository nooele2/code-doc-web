import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent {
  @Input() history: { code: string; response: string; name?: string; editing?: boolean }[] = [];
  @Output() selectItem = new EventEmitter<{ code: string; response: string }>();

  dropdownIndex: number | null = null;

  onSelect(item: { code: string; response: string }) {
    this.selectItem.emit(item);
    this.dropdownIndex = null;
  }

  toggleMenu(index: number) {
    this.dropdownIndex = this.dropdownIndex === index ? null : index;
  }

  renameItem(index: number) {
    this.history[index].editing = true;
    this.dropdownIndex = null;
  }

  deleteItem(index: number) {
    this.history.splice(index, 1);
    this.dropdownIndex = null;
  }
}
