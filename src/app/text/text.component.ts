import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { TableService } from '../table.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css'],
})
export class TextComponent implements OnInit {
  constructor(private router: Router, private tableService: TableService) {}

  textInput = new FormControl();

  processInput() {
    if (!this.textInput.value) return;
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

    // validating and converting to 2d array data structure
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
    this.tableService.table.data = tableData;
    this.router.navigate(['table']);
  }

  ngOnInit(): void {
    if (this.tableService.table.columns.length)
      this.textInput.setValue(this.tableService.getJSON());
  }
}
