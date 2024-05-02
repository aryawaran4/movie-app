import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NTRkZmM5MmQ2MzBjYmU4NjRhMzllMWU3NmJjYzdlNSIsInN1YiI6IjYxNmU4YzMzMTA4OWJhMDA0NGM2NzU0NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.P3DryXumKOqJdhTMRDQN7MEhsIilwlhYbNIF710Q6VQ';

  /**
   * Intercepts HTTP requests and adds an authorization header with the API key.
   * @param request The original HTTP request.
   * @param next The HTTP handler for the next interceptor in the chain.
   * @returns An Observable of the HTTP event stream.
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Clone the request and set the authorization header
    const authReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    // Pass the cloned request instead of the original request to the next handler
    return next.handle(authReq);
  }
}
