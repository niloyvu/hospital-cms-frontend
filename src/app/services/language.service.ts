import { TranslateService } from "@ngx-translate/core";
import { EventEmitter, Injectable } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { CommonService } from "./common.service";
import { AppError } from "../shared/core/app-error";
import { BadInput } from "../shared/core/bad-input";
import { DataService } from "./data.service";

@Injectable({
  providedIn: "root",
})
export class LanguageService {
  private API_URL: string = environment.API_URL;
  environmentObj = environment;
  private httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',

      'Authorization': this.common.getCookie(this.environmentObj.tokenKey) ?
        'Bearer ' + JSON.parse(decodeURIComponent(this.common.getCookie(this.environmentObj.tokenKey))).bearertoken :
        ''

    })

  };

  public chooseLanguage: string = localStorage.getItem("active_lang") ?? "en";

  public activeLangList: any[] = [];

  private resourcePath: string = "system/languages";

  private LoadEvent: EventEmitter<any> = new EventEmitter<string>();
  private LoadEventMenu: EventEmitter<any> = new EventEmitter<string>();

  private subscriptions: Subscription[] = [];

  constructor(
    private http: HttpClient,
    private common: CommonService,
    private translate: TranslateService,
    //private auth: AuthService,
    private _dataService: DataService //public dialog: MatDialog
  ) {
    this.activeLanguages();
    this.common.aClickedEvent.subscribe((data: string) => {
      this.activeLanguages();
    });
  }

  public add<T>(item: any): Observable<T> {
    const toAdd = item;
    return this.http.post<T>(
      this.API_URL + this.resourcePath,
      toAdd,
      this.httpHeader
    );
  }

  public delete<T>(id: number): Observable<T> {
    console.log('this.httpHeader', this.httpHeader);
    return this.http.delete<T>(this.API_URL + this.resourcePath + "/" + id, this.httpHeader);
  }

  public deleteParmanently<T>(id: number): Observable<T> {
    return this.http.delete<T>(this.API_URL + this.resourcePath + "/delete/" + id, this.httpHeader);
  }

  public activeLanguages = async () => {
    this._dataService
      .getJson(
        this.resourcePath +
        "?columns=id,name,code&limit=3&sortBy=id&sortOrder=desc&filterBy=active_language&filterValue=1",
        ""
      )
      .subscribe(async (response: any) => {
        if (response != undefined) {
          if (response.code == 200) {
            let languages: any = [];
            await response.data.data.forEach(async (element: any) => {
              languages.push(await element.code);
            });
            this.activeLangList = await response.data.data;
            this.translate.addLangs(await languages);
            this.translate.setDefaultLang(await this.chooseLanguage);

          } else {
            this.translate.setDefaultLang(await this.chooseLanguage);
          }
        }
      });
  };

  public getLanguages<T>(): Observable<T> {
    return this.http.get<T>(this.API_URL + this.resourcePath, this.httpHeader);
  }

  public getTrashedLanguages<T>(): Observable<T> {
    return this.http.get<T>(this.API_URL + this.resourcePath + '/trashed', this.httpHeader);
  }

  changeLanguage(language: string) {
    localStorage.setItem("active_lang", language);

    const queryString = "?active_language=" + language + "";
    this._dataService.getJson('dynamic-menu-by-role', queryString)
      .subscribe(data => {
        if (data.code == 200) {
          let env = this.common.environmentObj
          localStorage.removeItem(env.componentGroupPermission);
          localStorage.setItem(env.componentGroupPermission, encodeURIComponent(JSON.stringify(data.data.permissions)));
          localStorage.setItem(env.allComponentPermission, encodeURIComponent(JSON.stringify(data.data.all_componet_permission)));
          this.common.AClickedMenu('component clicked');
          this.common.AClicked('component clicked');
        } else {

        }
      },
        (error: AppError) => {
          if (error instanceof BadInput) {
          } else {
            throw error;
          }
        }
      );

    // 
    this.translate.use(language);
    this.chooseLanguage = language;
    this.loadMenu();
    this.load();
  }

  getTranslation(key: string) {
    var language = key;
    this.translate.get(key).subscribe((result: string) => {
      language = result;
    });
    return language;
  }

  private load = () => {
    this.LoadEvent.emit("Component A is clicked!!");
  };
  private loadMenu = () => {
    this.LoadEventMenu.emit("Component A is clicked!!");
  };
}
