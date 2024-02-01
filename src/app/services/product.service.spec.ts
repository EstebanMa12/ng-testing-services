import { TestBed } from "@angular/core/testing";
import { ProductsService } from "./product.service";
import { HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import { Product } from "../models/product.model";
import { environment } from "../../environments/environment";
import { generateManyProducts } from "../models/product.mock";
fdescribe('ProductsService', () => {
  let productService: ProductsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService]
    });
    productService = TestBed.inject(ProductsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  describe('tests for getAllSimple', () => {
    it('should return a product list',(doneFn)=>{
      //Arrange
      // * Esto es lo que yo voy a suponer que el servidor me va a devolver

      const mockData: Product[] = generateManyProducts(2);
      //Act
      productService.getAllSimple()
      .subscribe((data)=>{
        //Assert
        expect(data.length).toEqual(mockData.length);
        expect(data).toEqual(mockData);
        doneFn();
        // La función doneFn() se utiliza para indicar a Jasmine que la prueba es asincrónica y que debe esperar hasta que se llame a doneFn() antes de considerar que la prueba ha terminado. Esto es necesario porque las solicitudes HTTP son operaciones asincrónicas y la prueba necesita esperar hasta que se complete la solicitud antes de que pueda verificar los resultados.
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpTestingController.expectOne(url);
      // Montar el mock de datos
      req.flush(mockData);
      // Verificar que no hay mas peticiones pendientes
      httpTestingController.verify();
    })
  });

});
