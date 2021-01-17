import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable()
export class AurionInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip intercept if not a webAurion request
    if (!req.url.includes("https://web.isen-ouest.fr/webAurion/")) return next.handle(req);

    // Check if session has expired...
    return next.handle(req).pipe(map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        if (!event.url.includes("https://web.isen-ouest.fr/webAurion/")) {
          throw new HttpErrorResponse({
            error: 'Session has probably expired',
            headers: event.headers,
            status: 401,
            statusText: 'Warning',
            url: event.url
          });
        }
      }
      return event;
    }));
  }
}