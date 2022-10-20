import { ApiService } from './service/api.service';
import { DialogComponent } from './dialog/dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'crudApp';
  displayedColumns: string[] = ['productName', 'category', 'freshness','date', 'price', 'comment', 'action'];
  dataSource !: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.getAllProducts()
  }  

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "50%"
    }).afterClosed().subscribe(val => {
      if(val === 'save') {
        this.getAllProducts();
      }
    })
  }

  getAllProducts() {
    this.api.getProduct()
    .subscribe({
      next: (res) => { 
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        alert("error while fetching the data")
      }
    })
  }

  editProduct(row:any) {
    this.dialog.open(DialogComponent,{
      data:row
    }).afterClosed().subscribe(val => {
      if(val === 'update') {
        this.getAllProducts();
      }
    })
  }

  deleteProduct(id: number) {
    this.api.deleteProduct(id)
    .subscribe({
      next: (res) => {
        alert("Product deleted successfully");
        this.getAllProducts();
      },
      error: () => {
        alert("Error while deleting product");
      } 
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
