import { TestBed } from "@angular/core/testing";
import { ProductsService } from "./product.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CreateProductDTO, Product, UpdateProductDTO } from "../models/product.model";
import { environment } from "../../environments/environment";
import { generateManyProducts, generateOneProduct } from "../models/product.mock";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "../interceptors/token.interceptor";
fdescribe('ProductsService', () => {
  let productService: ProductsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        }
      ]
    });
    productService = TestBed.inject(ProductsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    // Verificar que no hay mas peticiones pendientes
    httpTestingController.verify();
  })

  it('should be created', () => {

    expect(productService).toBeTruthy();
  });

  describe('tests for getAllSimple', () => {
    it('should return a product list', (doneFn) => {
      //Arrange
      // * Esto es lo que yo voy a suponer que el servidor me va a devolver

      const mockData: Product[] = generateManyProducts(2);
      //Act
      productService.getAllSimple()
        .subscribe((data) => {
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

    })
  });

  describe('tests for getAll', () => {
    it('should return a product list', (doneFn) => {
      //Arrange
      // * Esto es lo que yo voy a suponer que el servidor me va a devolver
      const mockData: Product[] = generateManyProducts(3);
      //Act
      productService.getAll()
        .subscribe((data) => {
          //Assert
          expect(data.length).toEqual(mockData.length);
          // expect(data).toEqual(mockData);// Es normal que falle este test, ya que el servicio está modificando los datos que recibe del servidor. Entonces uno tiene los taxes mientras que otro no.
          doneFn();
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpTestingController.expectOne(url);
      // Montar el mock de datos
      req.flush(mockData);
      // Verificar que no hay mas peticiones pendientes
      httpTestingController.verify();
    })

    it('should return product list with taxes', (doneFn) => {
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, // 19 de impuestos
        },
        {
          ...generateOneProduct(),
          price: 200, // 38 de impuestos
        },
        {
          ...generateOneProduct(),
          price: 300, // 57 de impuestos
        },
        // Pruebas maliciosas para ver si el servicio está haciendo bien su trabajo
        {
          ...generateOneProduct(),
          price: 0, // 0 de impuestos
        },
        {
          ...generateOneProduct(),
          price: -100, // 0 de impuestos
        },
      ]
      // Act
      productService.getAll()
        .subscribe((data) => {
          //Assert
          expect(data.length).toEqual(mockData.length);
          expect(data[0].taxes).toEqual(19);
          expect(data[1].taxes).toEqual(38);
          expect(data[2].taxes).toEqual(57);
          expect(data[3].taxes).toEqual(0);
          expect(data[4].taxes).toEqual(0);
          doneFn();
        });


      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpTestingController.expectOne(url);
      // Montar el mock de datos
      req.flush(mockData);
    });

    it('should send query params with limit 10 and offset 2', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 2;
      // Act
      productService.getAll(limit, offset)
        .subscribe((data) => {
          //Assert
          expect(data.length).toEqual(mockData.length);
          doneFn();
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpTestingController.expectOne(url);
      // Montar el mock de datos
      req.flush(mockData);
      const params = req.request.params;

      expect(params.get('limit')).toEqual(limit.toString());
      expect(params.get('offset')).toEqual(offset.toString());

      // Verificar que no hay mas peticiones pendientes
      httpTestingController.verify();

    })

    it('shloud send query params with limit 10 and offset 0 ', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 0;
      // Act
      productService.getAll(limit, offset)
        .subscribe((data) => {
          //Assert
          expect(data.length).toEqual(mockData.length);
          doneFn();
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpTestingController.expectOne(url);
      // Montar el mock de datos
      req.flush(mockData);
      const params = req.request.params;

      expect(params.get('limit')).toEqual(limit.toString());
      expect(params.get('offset')).toEqual(offset.toString());

      // Verificar que no hay mas peticiones pendientes
      httpTestingController.verify();
    })
  })

  describe('tests for create()', () => {
    it('should return a new product', (doneFn) => {
      //Arrange
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'title',
        price: 100,
        description: 'description',
        categoryId: 12,
        images: ['image1', 'image2']
      }
      // Act
      productService.create({ ...dto })
        .subscribe((data) => {
          //Assert
          expect(data).toEqual(mockData);
          doneFn();
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpTestingController.expectOne(url);
      // Montar el mock de datos
      req.flush(mockData);

      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    })
  })

  describe('test for update()', () => {
    it('should return the updated product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct();
      const productId = '123';
      const dto: UpdateProductDTO = {
        title: 'title updated',
        price: 100
      };
      // Act
      productService.update(productId, { ...dto })
        .subscribe((data) => {
          //Assert
          expect(data).toEqual(mockData);
          doneFn();
        })

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpTestingController.expectOne(url);
      // Montar el mock de datos
      req.flush(mockData);

      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('PUT');
    })

  })

  describe('test for delete()', () => {
    it('should return the deleted product', (doneFn) => {
      // Arrange
      const productId = '1';

      productService.delete(productId)
        .subscribe((data) => {
          //Assert
          expect(data).toBe(true)
          doneFn();
        })

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpTestingController.expectOne(url);
      // Montar el mock de datos
      req.flush(true);

      expect(req.request.method).toEqual('DELETE');
    })
  })

  describe('test for getOne()', () => {
    it('should return the product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct();
      const productId = '1';

      productService.getOne(productId)
        .subscribe((data) => {
          //Assert
          expect(data).toEqual(mockData)
          doneFn();
        })

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpTestingController.expectOne(url);
      // Montar el mock de datos
      req.flush(mockData);

      expect(req.request.method).toEqual('GET');
    })
    it('should return the right msg when the status code is 404', (doneFn) => {
      // Arrange
      const id = '1';
      const msgError = '404 message';
      const mockError = {
        status: 404,
        statusText: msgError,
      };
      // Act
      productService.getOne(id).subscribe({
        error: (error) => {
          // assert
          expect(error).toEqual('No se encontro el producto');
          doneFn();
        },
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpTestingController.expectOne(url);
      req.flush(msgError, mockError);
      expect(req.request.method).toEqual('GET');
    })

    it('Should return the right msg when the status code is 409', (doneFn) => {
      //Arrange
      const id = '1';
      const msgError = '409 message';
      const mockError = {
        status: 409,
        statusText: msgError,
      };
      //Act
      productService.getOne(id).subscribe({
        error: (error) => {
          // assert
          expect(error).toEqual('Algo esta fallando en el servidor');
          doneFn();
        },
      });

      //http config
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpTestingController.expectOne(url);
      req.flush(msgError, mockError);
      expect(req.request.method).toEqual('GET');

    });

    it('Should return the right msg when the status code is 401', (doneFn) => {
      //Arrange
      const id = '1';
      const msgError = '401 message';
      const mockError = {
        status: 401,
        statusText: msgError,
      };
      //Act
      productService.getOne(id).subscribe({
        error: (error) => {
          // assert
          expect(error).toEqual('No tienes permisos para ver este producto');
          doneFn();
        },
      });

      //http config
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpTestingController.expectOne(url);
      req.flush(msgError, mockError);
      expect(req.request.method).toEqual('GET');

    });





  })

});
