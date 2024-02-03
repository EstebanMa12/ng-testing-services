import { MapsService } from "./maps.service";

describe( 'MapsService', () => {
  let service: MapsService;
  let geolocation: Geolocation;
  let platform: Platform;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MapsService, Geolocation, Platform]
    });
    service = TestBed.inject(MapsService);
    geolocation = TestBed.inject(Geolocation);
    platform = TestBed.inject(Platform);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call to getCurrentPosition', () => {
    const spy = spyOn(geolocation, 'getCurrentPosition').and.returnValue(Promise.resolve({coords: {latitude: 0, longitude: 0}}));
    service.getCurrentPosition();
    expect(spy).toHaveBeenCalled();
  });

  it('should call to getCurrentPosition and return an error', () => {
    const spy = spyOn(geolocation, 'getCurrentPosition').and.returnValue(Promise.reject('Error'));
    service.getCurrentPosition();
    expect(spy).toHaveBeenCalled();
  });
})
