import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsAPI = 'https://fakestoreapi.com/products';
  categories$ = this.http.get<string[]>('https://fakestoreapi.com/products/categories');
  products$ = this.http.get<Product[]>(this.productsAPI).pipe(catchError(this.handleError));
  selectedProduct$ = this.products$.pipe(
    map(products => products.find(product => product.id === 1)),
    tap(product => console.log('selectedProduct', product)),
  );

  productsByCategory$ = (category: string) =>
    this.http.get<Product[]>(`https://fakestoreapi.com/products/category/${category}`);

  constructor(private http: HttpClient) {}

  private handleError({ error }: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${error.status}: ${error.message}`;
    }
    console.error(error);
    return throwError(() => errorMessage);
  }
}