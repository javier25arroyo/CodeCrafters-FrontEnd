import { TestBed } from '@angular/core/testing';
import { SuggestionService } from './suggestion.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';


describe('SuggestionService', () => {
  let service: SuggestionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SuggestionService
      ]
    });

    service = TestBed.inject(SuggestionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('submitSuggestion should POST to endpoint with headers', () => {
    const token = 'abc';
    service.submitSuggestion(1, 'hola', token).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/suggestions`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({ ok: true });
  });

  it('getSuggestions should GET with auth header and credentials', () => {
    localStorage.setItem('access_token', '"tok"');

    service.getSuggestions().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/suggestions`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok');
    expect(req.request.withCredentials).toBeTrue();
    req.flush([]);
  });

  it('updateStatus should PUT to the status endpoint', () => {
    localStorage.setItem('access_token', '"tok"');

    service.updateStatus(99, 'approved').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/suggestions/99/status`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ status: 'approved' });
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ ok: true });
  });
});
