import { AfterViewInit, Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { HeaderService } from './services/subjects/header.service';
import { MenuItem } from './types/menuitem';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

	title!:string;
	menuItems!: MenuItem[];
	mItem!: MenuItem;

	appHeader!: any;
	appSpacerHeader!: any;
	appFooter!: any;
	appSpacerFooter!: any;

	constructor(
		private router: Router,
		private headerService: HeaderService ) {
	}

	ngOnInit(): void {
		this.title = 'American Dream';
		this.menuItems = [];
		this.changeMenuItemArray(['signup', 'signin', 'dashboard']);

		this.headerService.title_$
			.subscribe(title => {
				this.onTitleChange(title);
			});
		this.headerService.menuItems_$
			.subscribe(menuItem => {
				this.onMenuNavigate(menuItem);
			});

	}

	ngAfterViewInit(): void {
		this.appHeader = document.querySelector('app-header');
		let appHeaderHeight = this.appHeader.firstChild.clientHeight;
		this.appSpacerHeader = document.querySelector('#spacer_header');
		this.appSpacerHeader.style.height = appHeaderHeight + 'px';

		this.appFooter = document.querySelector('app-footer');
		let appFooterHeight = this.appFooter.firstChild.clientHeight;
		this.appSpacerFooter = document.querySelector('#spacer_header');
		this.appSpacerFooter.style.height = appFooterHeight + 'px';
	}

	onTitleChange(event:any) {
		switch (event) {
			case 'home': this.title = 'App Template'; break;
			case 'signup': this.title = 'Sign Up'; break;
			case 'signin': this.title = 'Sign In'; break;
			case 'dashboard': this.title = 'Dashboard'; break;
			default: this.title = event.charAt(0).toUpperCase() + event.slice(1);
		}
	}

	onMenuNavigate(event:any) {

		this.menuItems = [];

		let items = new Array<string>();

		switch(event) {

			/* HOME HAMBURGER MENU */
			case '': items = ['signup', 'signin', 'dashboard']; break;
			case 'home': items = ['signup', 'signin', 'dashboard']; break;
			case 'signup': items = ['signin']; break;
			case 'signin': items = ['signup']; break;
			case 'dashboard': items = ['home']; break;


		}
		this.changeMenuItemArray(items);
	}

	changeMenuItemArray(menuName:string[]) {
		menuName.forEach(menuItem => {

			let mItem: MenuItem = {
				liClass: "navbar-nav me-auto mb-2 mb-lg-0",
				aClasses: ["nav-item", "nav-link"],
				routerLink: menuItem,
				text: menuItem.charAt(0).toUpperCase() + menuItem.slice(1),
				href: ''
			};
			switch (menuItem) {
				case 'home': mItem.text = 'Home'; break;
				case 'signup': mItem.text = 'Sign Up'; break;
				case 'signin': mItem.text = 'Sign In'; break;
				case 'dashboard': mItem.text = 'Dashboard'; break;
			}
			this.menuItems.push(mItem);
		});
	}
	
	onActivate(event:any) {
		this.router.events.forEach((event) => {
			if (event instanceof NavigationStart) {

				//Clear the menu items array
				this.menuItems = [];

				//Change the menu items array based on the route
				let menu_array: string[] = [];
				switch (event.url) {
					case '/': menu_array = ['signup', 'signin', 'dashboard']; break;
					 
					case '/home': menu_array = ['signup', 'signin', 'dashboard']; break;
					case '/signup': menu_array = ['home', 'signin']; break;
					case '/signin': menu_array = ['home', 'signup']; break;
					case '/dashboard': menu_array = ['home']; break;


					default: menu_array = ['dashboard', 'logout'];
				}

				//effect the menu item change
				this.changeMenuItemArray(menu_array);

				//Change the title
				this.onTitleChange(event.url.split('/')[1]);
			}
			// NavigationEnd, NavigationCancel, NavigationError, RoutesRecognized
		});
	}


}