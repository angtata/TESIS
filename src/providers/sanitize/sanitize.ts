
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeUrl',
  pure: false
})

export class SanitizeProvider implements PipeTransform {
  transform(value: string, args?: any): any {            
    return this.domSanitizer.bypassSecurityTrustUrl(value);
  }

  constructor(private domSanitizer: DomSanitizer) {
    console.log('Hello SanitizeProvider Provider');
  }

}
