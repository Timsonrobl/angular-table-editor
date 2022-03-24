import { Injectable } from '@angular/core';
import { stringify as stringifyCSV } from 'csv-stringify/browser/esm/sync';

export type ExportTypes = 'json' | 'csv';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  table = {
    columns: [] as string[],
    data: [] as string[][],
  };

  exportType: ExportTypes = 'json';

  getObjectsArray() {
    // formatting back from 2d array to array of objects
    const formattedObject: { [key: string]: string }[] = [];
    this.table.data.forEach((row, rowIndex) => {
      formattedObject.push({});
      this.table.columns.forEach((column, columnIndex) => {
        formattedObject[rowIndex][column] =
          this.table.data[rowIndex][columnIndex];
      });
    });
    return formattedObject;
  }

  getJSON() {
    return JSON.stringify(this.getObjectsArray());
  }
  getCSV() {
    return stringifyCSV(this.getObjectsArray(), {
      header: true,
      columns: this.table.columns,
    });
  }

  constructor() {}
}
