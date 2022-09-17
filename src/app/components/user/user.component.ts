import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database/database.service';
import { Observable } from 'rxjs';


@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css']
})


export class UserComponent implements OnInit {

	//User Data
	id?: any = 0;
	displayName?: string = "";
	directory?: string = "";
	emailAddress?: string = "";
	emailVerified?: boolean = false;
	express_data?: string;
	firstName?: string = "";
	firestore_doc_id?: string;
	hasAccount?: boolean = false;
	lastName?: string = "";
	lastLogin?: string = "";
	message?: string;
	photoURL?: string = "";
	public?: boolean = false;
	uid?: string = ""; //Ex?:  kaTXr6Pg62RGp5DQUUNUMnXsh2n1
	refreshToken?: string = "";
	role?: number;
	status?: boolean;
	uid_type?: string;
	userName?: string;


	mode!: string;
	constructor(private database: DatabaseService) { }

	ngOnInit(): void {}

	//returns Observable<any>
	getUser(email:string): Observable<any> {
		return this.database.getData("users", "emailAddress", email);
		
	}
}