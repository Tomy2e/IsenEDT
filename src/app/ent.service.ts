import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EntService {

  constructor(private http: HttpClient) { }

  private readonly authUrl: string = "https://auth.isen-ouest.fr/cas/login?service=https%3A%2F%2Fweb.isen-ouest.fr%2FwebAurion%2F%2Flogin%2Fcas";
  private domParser = new DOMParser();

  public async loginAurion(username: string, password: string): Promise<boolean> {
    // Get and parse execution key
    let authPage = await this.http.get(this.authUrl, { responseType: 'text' }).toPromise();
    let domAuthPage = this.domParser.parseFromString(authPage, 'text/html');
    let execution = (<HTMLInputElement>domAuthPage.getElementsByName("execution")[0]).value;
    
    // Create login payload
    const payload = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('execution', execution)
      .set('_eventId', 'submit');

    //  Send login request
    try {
      let authentication = await this.http.post(this.authUrl, payload, {
        responseType: 'text',
        observe: 'response',
        withCredentials: true,
      }).toPromise();

      if(authentication.url === "https://web.isen-ouest.fr/webAurion/") return true;
      else return false;

    } catch(error) {
      if(error instanceof HttpErrorResponse && error.status === 401) return false;
      else throw error;
    }
  }
}
