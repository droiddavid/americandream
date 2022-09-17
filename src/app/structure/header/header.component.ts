import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	@Input() title!:string;
	@Input() menuItems!:any;

	@Output() onTitleChange = new EventEmitter<string>();
	@Output() onMenuItemChange = new EventEmitter<any>();

	isLoggedIn: boolean = false;

	constructor() { }
	
	ngOnInit(): void {
		let temp:any = localStorage.getItem("isLoggedIn");

		if (temp !== null) {
			this.isLoggedIn = JSON.parse(GlobalService.decode(temp));
		}
	}

	menuNavigate(routerLinkName:any) {

		let _navBar = document.getElementsByClassName("navbar-collapse");
		if(_navBar.length > 0) {
			_navBar[0].classList.remove("show");
		}

		this.onMenuItemChange.emit(routerLinkName);
		this.onTitleChange.emit(routerLinkName);
	}

	signOut () {
		this.isLoggedIn = false;
		localStorage.clear();
		localStorage.setItem(
			"isLoggedIn", 
			GlobalService.encode(
				JSON.stringify(
					{
						"isLoggedIn" : this.isLoggedIn
					}
				)
			)
		);
	}
}