import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableService } from '../table.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  table = this.tableService.table;
  constructor(private router: Router, private tableService: TableService) {}

  onExportClick() {
    this.router.navigate(['text']);
  }

  ngOnInit(): void {}
}
