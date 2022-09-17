import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	constructor(private router: Router) { }

	ngOnInit(): void {
	}

	signup() {
		console.log("Signin up.");
		this.router.navigate(['signup']);
	}
	
	signin() {
		console.log("Signing in.");
		this.router.navigate(['signin']);
	}
	
	proceedAsGuest() {
		console.log("Proceeding as guest.");
		this.router.navigate(['guest']);		
	}
}