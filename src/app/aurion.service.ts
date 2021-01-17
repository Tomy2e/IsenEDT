import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from './course';
import { Day } from './day';
import { Event } from './event'

@Injectable({
  providedIn: 'root'
})
export class AurionService {

  constructor(private http: HttpClient) { }

  private domParser = new DOMParser();

  public async getName(): Promise<string> {
    let page = await this.http.get('https://web.isen-ouest.fr/webAurion/faces/MainMenuPage.xhtml', { responseType: 'text', withCredentials: true }).toPromise();
    let parsedPage = this.domParser.parseFromString(page, 'text/html');
    let name = (<HTMLLIElement>parsedPage.getElementsByClassName("menuMonCompte")[0].getElementsByClassName("ui-widget-header")[0]).innerText;
    return name;
  }

  private parseAurionPlanning(jsonObject: { events: Event[] }): Day[] {
    let days: Day[] = [];

    for (let event of jsonObject.events) {
      // Convert event object to course object
      let title = event.title.split(' - ');

      let course: Course = {
        allDay: event.allDay,
        end: new Date(event.end),
        start: new Date(event.start),
        de: title[0].split(' à ')[0],
        a: title[0].split(' à ')[1],
        type: title[2],
        matiere: title[3],
        cours: title[4],
        groupe: title[6],
        prof: title[5],
        salle: title[1],
      };

      // Find corresponding day
      let day = days.find(d => d.date.toDateString() === course.start.toDateString());

      // If corresponding day does not exist, create new day
      if(day === undefined) day = days[days.push({
        date: new Date(course.start.toDateString()),
        humanDate: course.start.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
        courses: [],
      }) - 1];

      // Push course object to day array
      day.courses.push(course);
    }

    return days;
  }

  public async fetchEdt(range: {start: Date, end: Date}): Promise<Day[]> {
    const options = {
      responseType: 'text' as const,
      withCredentials: true,
    };

    // Get viewstate and menuid
    const payloadHomepage = new HttpParams().set('j', 'j');
    let homepage = await this.http.post('https://web.isen-ouest.fr/webAurion/faces/MainMenuPage.xhtml', payloadHomepage, options).toPromise();
    let parsedHomepage = this.domParser.parseFromString(homepage, 'text/html');
    let viewstate = (<HTMLInputElement>parsedHomepage.getElementsByName('javax.faces.ViewState')[0]).value;
    let menuid = (<HTMLAnchorElement>parsedHomepage.getElementsByClassName("item_291892")[0]).getAttribute('onclick').split("'")[11];

    // Generate planning for current week (to get j_idt value)
    const payloadPlanning = new HttpParams()
      .set('form', 'form')
      .set('form:largeurDivCenter', '898')
      .set('javax.faces.ViewState', viewstate)
      .set('form:sidebar_menuid', menuid)
      .set('form:sidebar', 'form:sidebar')
      .set('form:sauvegarde', '');
    let planning = await this.http.post('https://web.isen-ouest.fr/webAurion/faces/MainMenuPage.xhtml', payloadPlanning, options).toPromise();
    let parsedPlanning = this.domParser.parseFromString(planning, 'text/html');
    viewstate = (<HTMLInputElement>parsedPlanning.getElementsByName('javax.faces.ViewState')[0]).value;
    let idt = (<HTMLDivElement>parsedPlanning.getElementsByClassName("schedule")[0]).id;

    // Generate custom planning
    const payloadCustomPlanning = new HttpParams()
      .set('form', 'form')
      .set('javax.faces.partial.ajax', 'true')
      .set('javax.faces.source', idt)
      .set('javax.faces.partial.execute', idt)
      .set('javax.faces.partial.render', idt)
      .set('form:largeurDivCenter', '1603')
      .set(idt, idt)
      .set(idt + '_start', range.start.getTime().toString())
      .set(idt + '_end', range.end.getTime().toString())
      .set(idt + '_view', 'month')
      .set('javax.faces.ViewState', viewstate);
    let customPlanning = await this.http.post('https://web.isen-ouest.fr/webAurion/faces/Planning.xhtml', payloadCustomPlanning, options).toPromise();
    let parsedCustomPlanning = this.domParser.parseFromString(customPlanning, 'text/xml');
    let rawJsonPlanning = (<HTMLElement>parsedCustomPlanning.getElementById(idt)).textContent;
    let parsedJsonPlanning: { events: Event[] } = JSON.parse(rawJsonPlanning);

    return this.parseAurionPlanning(parsedJsonPlanning);
  }
}
