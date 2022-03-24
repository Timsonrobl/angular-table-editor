import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportTypes, TableService } from '../table.service';

function arrayHasDuplicates(array: any[]) {
  return new Set(array).size !== array.length;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  table = this.tableService.table;
  constructor(private router: Router, private tableService: TableService) {}

  trackCell = (index: number, cell: string) => index + cell;

  onExportClick(type: ExportTypes) {
    if (
      this.tableService.table.columns.includes('') ||
      arrayHasDuplicates(this.tableService.table.columns)
    ) {
      alert('Для экспорта все столбцы должны иметь *уникальные* названия');
      return;
    }
    this.tableService.exportType = type;
    this.router.navigate(['text']);
  }

  updateCell(event: FocusEvent, row: number, column: number) {
    const target = event.target as HTMLTableCellElement;
    this.table.data[row][column] = target.innerText;
  }

  updateColumn(event: FocusEvent, column: number) {
    const target = event.target as HTMLTableCellElement;
    this.table.columns[column] = target.innerText;
  }

  deleteRow(rowIndex: number) {
    this.table.data.splice(rowIndex, 1);
  }

  swapRows(rowA: number, rowB: number) {
    const previous = this.table.data[rowA];
    this.table.data[rowA] = this.table.data[rowB];
    this.table.data[rowB] = previous;
  }

  addRow() {
    const emptyRow = Array(this.table.columns.length).fill('');
    this.table.data.push(emptyRow);
  }

  addColumn() {
    this.table.columns.push('');
    this.table.data.forEach((row) => {
      row.push('');
    });
  }

  ngOnInit(): void {
    if (!this.tableService.table.columns.length)
      this.router.navigateByUrl('text');
  }
}
