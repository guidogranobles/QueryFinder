import {Directive,  ElementRef} from '@angular/core';
declare var PR: any;

@Directive({
    selector: '[dg-prettify]'
})
export class PrettifyDirective {

    constructor(private el: ElementRef) { }

    ngAfterViewInit() {
        var innerHTML = this.el.nativeElement.innerHTML;
        var newHtml =  PR.prettyPrintOne(innerHTML, 'lang-sql');
        this.el.nativeElement.innerHTML = newHtml;
    }

}
