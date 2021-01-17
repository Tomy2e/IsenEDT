import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class EntService {

  constructor(private http: HTTP) { }

  private readonly authUrl: string = "https://auth.isen-ouest.fr/cas/login?service=https%3A%2F%2Fweb.isen-ouest.fr%2FwebAurion%2F%2Flogin%2Fcas";
  private domParser = new DOMParser();

  public async loginAurion(username: string, password: string): Promise<boolean> {
    // Clear cookies
    this.http.clearCookies();
    this.http.setFollowRedirect(false);

    // Get and parse execution key
    let authPage = await this.http.get(this.authUrl, {}, {});
    let domAuthPage = this.domParser.parseFromString(authPage.data, 'text/html');
    let execution = (<HTMLInputElement>domAuthPage.getElementsByName("execution")[0]).value;

    //  Send login request
    
    let nextRq: HTTPResponse = null;
    try {
      // Should fail with 401 if invalid credentials or 302 if successful
      await this.http.post(this.authUrl, {
        username,
        password,
        execution,
        '_eventId': 'submit',
      }, {});

      return false; // This line should never be reached, return false as a fail-safe
    } catch(error) {
      if(error.status === 401) return false;
      else if(error.status === 302) nextRq = error;
      else throw error;
    }

    try {
      await this.http.get(nextRq.headers['location'], {}, {});
    } catch(error) {
      if(error.status === 302) return true;
      else throw error;
    }
  }
}
