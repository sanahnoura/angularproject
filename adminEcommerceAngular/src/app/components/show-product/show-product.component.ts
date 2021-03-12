import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ProductsService } from 'src/app/services/products.service';
import { Response } from 'src/app/models/response';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css']
})
export class ShowProductComponent implements OnInit {


  @Input()
  products!: Product[];
  productModalOpen = false;
  selectedProduct: Product| any;
  file: File | undefined;
  progress = 0;
  baseUrlImage= `${environment.api_image}`;
 

  constructor(private productService: ProductsService,
               private fileService: FileUploadService) { }

  ngOnInit(): void {
  }


  onEdit(product: Product): void {
    this.productModalOpen = true;
    this.selectedProduct = product;

  }

  onDelete(product: Product): void {
    
  }

  
 addProduct(): void {
   this.selectedProduct = undefined;
   this.productModalOpen = true;


    
  }

  handleFinish(event: any){
    let product  = event.product ? event.product : null;
    this.file = event.file ? event.file: null;
    
    if(product){
      console.log(product);
      if(this.selectedProduct){
       //edit Product
        product.idProduct = this.selectedProduct.idProduct;
        this.edditProductToServer(product);
      }else{
        //add Product
        this.addProductToServer(product);
      }
    }



this.productModalOpen = false;

  }
  uploadImage(event: any){
    switch (event.type) {
      case HttpEventType.Sent:
        console.log("Requete envoyée avec succès");
        break;
      case HttpEventType.UploadProgress:
        this.progress = Math.round(event.loaded / event.total * 100);
    
        break;
        case HttpEventType.Response:
           console.log(event.body);
           setTimeout(() => {
           this.progress = 0;
         }, 1500);
        }
  }
  
  addProductToServer(product: any){
    this.productService.addProduct(product).subscribe(
      (data: Response)=>{
        if(data.status == 200){
          //mise a jour frontend

          if (this.file){
            this.fileService.uploadImage(this.file).subscribe(
              (events: HttpEvent<any>)=>{
                this.uploadImage(event);
                
                    

              }
            )
          }
          product.idProduct = data.args.lastInsertId;
          this.products.push(product);
        }
      }
    )
  }

  edditProductToServer(product: any){

    this.productService.edditProduct(product).subscribe(
      (data: Response)=>{
        if(data.status == 200){
          if(this.file){
            this.fileService.uploadImage(this.file).subscribe(
              (event: HttpEvent<any>)=>{
                this.uploadImage(event);
               
              }
            );
            this.fileService.deleteImage(product.oldImage).subscribe(
              (data: Response)=>{
                console.log(data);
              }
            );
          }

          //update frontend
          const index = this.products.findIndex(p =>p.idProduct == product.idProduct);
         
          this.products = [
                  ...this.products.slice(0,index),
                  product,
                  ...this.products.slice(index+1)
           ]

        }else{
          console.log(data.message);
        }
      }
    )

    
  }

}
