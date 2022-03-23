import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  table = {
    columns: [] as string[],
    data: [] as string[][],
  };

  getJSON() {
    // formatting back from 2d array to array of objects
    const formattedObject = [] as { [key: string]: string }[];
    this.table.data.forEach((row, rowIndex) => {
      formattedObject.push({});
      this.table.columns.forEach((column, columnIndex) => {
        formattedObject[rowIndex][column] =
          this.table.data[rowIndex][columnIndex];
      });
    });
    return JSON.stringify(formattedObject);
  }

  constructor() {}
}
