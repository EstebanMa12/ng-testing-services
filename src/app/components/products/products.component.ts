import { Product } from './../../models/product.model';
import { Component } from '@angular/core';
import { ProductsService } from '../../services/product.service';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.sass'
})
export class ProductsComponent {

  products : Product[] = [];

  constructor(private productService: ProductsService) { }

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAllSimple().subscribe(products => this.products = products);
  }

}
