import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activeLanguage'
})
export class ActiveLanguagePipe implements PipeTransform {

  private activeLanguage = localStorage.getItem("active_lang") ?? 'en';

  transform(object: any[], key: string): string {
    const findItem = object?.find(item => item.local == this.activeLanguage || item.locale == this.activeLanguage);
    return (findItem && findItem[key]) ? findItem[key] : '';
  }

}
