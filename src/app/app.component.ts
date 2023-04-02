import { DialogComponent } from './dialog/dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'CRUD';
  displayedColumns: string[] = ['productName', 'category', 'date', 'freshness', 'price', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,
              private api: ApiService ){
    
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
     width:'30%'
    }).afterClosed().subscribe( () => {
      {
        this.getAllProduct();
      }
    })
    ;
  }
  getAllProduct() {
    this.api.getProduct().subscribe({
      next:(res) => {
        console.log(res);
        
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
      },
      error: (err)=> {
        alert("Error while fetching the products!")
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
  editProduct(row: any){
    this.dialog.open(DialogComponent,{
      width: '30%',
      data:row
    }).afterClosed().subscribe(val =>{
      if(val === 'update'){
        this.getAllProduct();
      }
    })
  }
  deleteProduct(id: number){
    this.api.deleteProduct(id)
      .subscribe({
        next: (res) => {
          alert("Product deleted succesfully")
          this.getAllProduct();
        },
        error : ()=>{
          alert("Error while deleting the record")
        }
      })
  }

  ngOnInit(){
    this.getAllProduct();
  }
}



