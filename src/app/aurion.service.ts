import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Course } from './course';
import { Day } from './day';
import { Event } from './event'

@Injectable({
  providedIn: 'root'
})
export class AurionService {

  constructor(private http: HTTP) { }

  private domParser = new DOMParser();

  public async getName(): Promise<string> {
    this.http.setFollowRedirect(false);
    let page = await this.http.get('https://web.isen-ouest.fr/webAurion/faces/MainMenuPage.xhtml', {}, {});
    let parsedPage = this.domParser.parseFromString(page.data, 'text/html');
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
        humanDate: course.start.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
        courses: [],
      }) - 1];

      // Push course object to day array
      day.courses.push(course);
    }

    return days;
  }

  public async fetchEdt(range: {start: Date, end: Date}): Promise<Day[]> {
    this.http.setFollowRedirect(false);

    // Get viewstate and menuid
    let homepage = await this.http.post('https://web.isen-ouest.fr/webAurion/faces/MainMenuPage.xhtml', {j: 'j'}, {});
    let parsedHomepage = this.domParser.parseFromString(homepage.data, 'text/html');
    let viewstate = (<HTMLInputElement>parsedHomepage.getElementsByName('javax.faces.ViewState')[0]).value;
    let menuid = (<HTMLAnchorElement>parsedHomepage.getElementsByClassName("item_291892")[0]).getAttribute('onclick').split("'")[11];

    // Generate planning for current week (to get j_idt value)
    let planning: HTTPResponse;
    try {
      this.http.setFollowRedirect(true);
      planning = await this.http.post('https://web.isen-ouest.fr/webAurion/faces/MainMenuPage.xhtml', {
      'form': 'form',
      'form:largeurDivCenter': '898',
      'javax.faces.ViewState': viewstate,
      'form:sidebar_menuid': menuid,
      'form:sidebar': 'form:sidebar',
      'form:sauvegarde': '',
    }, {});

    if(planning.url !== "https://web.isen-ouest.fr/webAurion/faces/Planning.xhtml") throw new Error("Unexpected page");
    } catch(error) {
      throw error;
    } finally {
      this.http.setFollowRedirect(false);
    }

    let parsedPlanning = this.domParser.parseFromString(planning.data, 'text/html');
    viewstate = (<HTMLInputElement>parsedPlanning.getElementsByName('javax.faces.ViewState')[0]).value;
    let idt = (<HTMLDivElement>parsedPlanning.getElementsByClassName("schedule")[0]).id;

    // Generate custom planning
    let customPlanning = await this.http.post('https://web.isen-ouest.fr/webAurion/faces/Planning.xhtml', {
      'form': 'form',
      'javax.faces.partial.ajax': 'true',
      'javax.faces.source': idt,
      'javax.faces.partial.execute': idt,
      'javax.faces.partial.render': idt,
      'form:largeurDivCenter': '1603',
      [`${idt}`]: idt,
      [`${idt}_start`]: range.start.getTime().toString(),
      [`${idt}_end`]: range.end.getTime().toString(),
      [`${idt}_view`]: 'month',
      'javax.faces.ViewState': viewstate,
    }, {});
    let parsedCustomPlanning = this.domParser.parseFromString(customPlanning.data, 'text/xml');
    let rawJsonPlanning = (<HTMLElement>parsedCustomPlanning.getElementById(idt)).textContent;
    let parsedJsonPlanning: { events: Event[] } = JSON.parse(rawJsonPlanning);

    return this.parseAurionPlanning(parsedJsonPlanning);
  }
}
