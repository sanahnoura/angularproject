import { Component, Input, OnDestroy, OnInit, Output,EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-add-or-edit-product-modal',
  templateUrl: './add-or-edit-product-modal.component.html',
  styleUrls: ['./add-or-edit-product-modal.component.css']
})
export class AddOrEditProductModalComponent implements OnInit,OnChanges, OnDestroy {

  @Input()
  product!: Product;
  @Output() finish = new EventEmitter();
 
  productForm: FormGroup | any;
  categories!: Category[];
  categorySub!: Subscription;
  idCategory = 1;
  file: File | undefined;

  constructor(private fb: FormBuilder,
              private catergoriesService: CategoriesService) {


    this.productForm = fb.group({
      productInfo: fb.group({
        name: ['', Validators.required],
        description:  ['', Validators.required],
        price:  ['', Validators.required],
        stock:  ['', Validators.required],
      }),
      illustration: fb.group({
        image:  [null, Validators.required]
      })


    })
   }

   selectCategory(id: number){
     this.idCategory = id;

   }

   get isProductInfosInvalid(): boolean{
      return this.productForm.get('productInfo').invalid;
 
  }
  get isIllustrationInvalid(): boolean {
    if(this.product){
      return false;
    }
    return this.productForm.get('illustration').invalid;
   
}

handleCancel(){
  this.finish.emit();
  this.close();
}
handleFinish(){
  const product = {
    ...this.productForm.get('productInfo').value,
    ...this.productForm.get('illustration').value,
    Category: this.idCategory
  }
  if(this.file){
    product.image = this.file.name;
  }else{
    product.image = this.product.oldImage;
  }
  this.finish.emit({product: product, file: this.file  ?  this.file:  null});
  this.close();

}

close(){
  this.productForm.reset();
  this.idCategory = 1;
}

detectefiles(event: any){
  this.file = event.target.files[0];

}
updateForm(product: Product){
  this.productForm.patchValue({
    productInfo:{
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    }
  });
  product.oldImage = product.image;
  this.selectCategory(product.Category);
}
  

  ngOnInit(): void {
    this.categorySub = this.catergoriesService.getCategory().subscribe(
      (response)=>{
        this.categories = response.result;
        //console.log(this.categories);
      }
    )
  }

  ngOnChanges(): void{
    if(this.product){
      this.updateForm(this.product);
    }

  }


  ngOnDestroy(): void {
    this.categorySub.unsubscribe();

  }

}

