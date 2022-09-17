import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class HeaderService {

	private title_source = new Subject<string>();
	title_$ = this.title_source.asObservable();

	private menuItems_source = new Subject<string>();
	menuItems_$ = this.menuItems_source.asObservable();

	constructor() { }

	changeTitle(title:string) {
		this.title_source.next(title);
	}
	changeMenuItems(menuItem:string) {
		this.menuItems_source.next(menuItem);
	}
}