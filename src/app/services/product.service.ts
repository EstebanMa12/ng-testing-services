import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { Observable, throwError, zip } from 'rxjs';

import { Product, CreateProductDTO, UpdateProductDTO } from './../models/product.model';
import { environment } from './../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${environment.API_URL}/api/v1`;

  constructor(
    private http: HttpClient
  ) { }

  getByCategory(categoryId: string, limit?: number, offset?: number){
    let params = new HttpParams();
    if (limit && offset != null) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(`${this.apiUrl}/categories/${categoryId}/products`, { params })
  }

  getAllSimple(){
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  /**
   * Retrieves all products.
   *
   * @param limit - The maximum number of products to retrieve.
   * @param offset - The number of products to skip before starting to retrieve.
   * @returns An Observable that emits an array of products.
   */

  // Lo que hace Observable<Product[]> es que le dice al tipado que no importa el cambio que se haga, esto siempre va a ser un array de productos y no va a cambiar.
  getAll(limit?: number, offset?: number): Observable<Product[]> {
    let params = new HttpParams();
    if (limit && offset != null) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params })
    .pipe(
      // Si algo sale mal, reintentar 3 veces
      retry(3),

      map(products => products.map(item => {
        return {
          ...item,
          taxes: item.price > 0? .19 * item.price : 0
         }
      }))
    );
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDTO) {
    return zip(
      this.getOne(id),
      this.update(id, dto)
    );
  }

  getOne(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          return new Observable(subscriber => {
            subscriber.error('Algo esta fallando en el servidor');
          })
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError(()=> new Error('No se encontro el producto'))
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError(()=> new Error('No tienes permisos para ver este producto'))
        }
        return throwError(()=> new Error('Ups! Algo salio mal'));
      })
    )
  }

  create(dto: CreateProductDTO) {
    return this.http.post<Product>(`${this.apiUrl}/products`, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/products/${id}`);
  }
}
