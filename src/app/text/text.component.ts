import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { TableService } from '../table.service';
import { parse as parseCSV } from 'csv-parse/browser/esm/sync';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css'],
})
export class TextComponent implements OnInit {
  constructor(private router: Router, private tableService: TableService) {}

  textInput = new FormControl(
    '[{"name":"Name 1","year":"2010"},{"name":"Name 2","year":"1997"},{"name":"Name3","year":"2004"}]'
  );

  processJSON(input: string) {
    // parsing JSON and handling JSON parser errors
    let parsedData;
    try {
      parsedData = JSON.parse(input);
    } catch (error) {
      if (error instanceof SyntaxError) {
        alert(`Ошибка парсинга JSON: ${error.message}`);
      }
      return;
    }

    // validating data object and converting to 2d array data structure
    if (
      !Array.isArray(parsedData) ||
      parsedData.length === 0 ||
      Object.keys(parsedData[0]).length === 0
    ) {
      alert('Ошибка формата данных');
      return;
    }
    const columns = Object.keys(parsedData[0]);
    let data: string[][] = [];
    parsedData.forEach((row, rowIndex) => {
      data.push([]);
      columns.forEach((column, columnIndex) => {
        data[rowIndex][columnIndex] = row[column]?.toString() || '';
      });
    });
    return {
      columns,
      data,
    };
  }

  processCSV(input: string) {
    const csvData = parseCSV(input, {
      skip_empty_lines: true,
    });
    const columns: string[] = csvData[0];
    const data: string[][] = csvData.splice(1);
    return {
      columns,
      data,
    };
  }

  processInput() {
    if (!this.textInput.value) return;
    if (
      this.textInput.value.startsWith('[') &&
      this.textInput.value.endsWith(']')
    ) {
      const tableData = this.processJSON(this.textInput.value);
      if (tableData?.data) {
        this.tableService.table = tableData;
      } else return;
    } else {
      let csvData;
      try {
        csvData = this.processCSV(this.textInput.value);
      } catch (error) {
        if (error instanceof Error) {
          alert(`Ошибка парсинга CSV: ${error.message}`);
        }
        return;
      }
      this.tableService.table = csvData;
    }
    this.router.navigate(['table']);
  }

  async onFileUpload(event: Event) {
    const file = (<HTMLInputElement>event.target).files?.[0];
    if (!file) return;
    const data = await file.text();
    this.textInput.setValue(data);
  }

  downloadFile(event: MouseEvent) {
    const target = event.target as HTMLAnchorElement;
    target.download = `table-export.${this.tableService.exportType}`;
    const blob = new Blob([this.textInput.value], {
      type: 'text/plain;charset=utf8',
    });
    const url = URL.createObjectURL(blob);
    target.href = url;
  }

  ngOnInit(): void {
    if (!this.tableService.table.columns.length) return;
    if (this.tableService.exportType === 'json') {
      this.textInput.setValue(this.tableService.getJSON());
    } else {
      this.textInput.setValue(this.tableService.getCSV());
    }
  }
}
