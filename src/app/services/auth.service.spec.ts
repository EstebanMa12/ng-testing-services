import { TokenService } from './token.service';
import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Auth } from '../models/auth.model';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        TokenService,
      ]
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test for login' , () => {
    it('should return a token', (doneFn) => {
      const mockData: Auth = {
        access_token: '123456',
      };
      const email = 'su@tabenel.cv';
      const password = '0107403885'

      // Act
      service.login(email, password)
      .subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // Http config
      const url = `${environment.API_URL}/api/auth/login`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(mockData);

    });

    it('Should retunr a token with spy',(doneFn) => {
      const mockData: Auth = {
        access_token: '123456',
      };
      const email = 'su@tabenel.cv';
      const password = '0107403885';
      spyOn(tokenService, 'saveToken').and.callThrough();


      // Act
      service.login(email, password)
      .subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
        expect(tokenService.saveToken).toHaveBeenCalledOnceWith('123456')
        doneFn();
      });

      // Http config
      const url = `${environment.API_URL}/api/auth/login`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(mockData);
    });
  });


});
