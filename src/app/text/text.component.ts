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

  parseJSON() {
    // parsing JSON and handling JSON parser errors
    let parsedData; //: { [key: string]: any }[];
    try {
      parsedData = JSON.parse(this.textInput.value);
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
    this.tableService.table.columns = Object.keys(parsedData[0]);
    let tableData: string[][] = [];
    parsedData.forEach((row, rowIndex) => {
      tableData.push([]);
      this.tableService.table.columns.forEach((column, columnIndex) => {
        tableData[rowIndex][columnIndex] = row[column]
          ? row[column].toString()
          : '';
      });
    });
    return tableData;
  }

  processInput() {
    if (!this.textInput.value) return;
    if (this.textInput.value.startsWith('[')) {
      const tableData = this.parseJSON();
      if (tableData) {
        this.tableService.table.data = tableData;
      } else return;
    } else {
      const csvData = parseCSV(this.textInput.value, {
        skip_empty_lines: true,
      });
      this.tableService.table.columns = csvData[0];
      this.tableService.table.data = csvData.splice(1);
      console.log(csvData);
    }
    this.router.navigate(['table']);
  }

  ngOnInit(): void {
    if (this.tableService.table.columns.length)
      this.textInput.setValue(this.tableService.getJSON());
  }
}
