import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faBars, faHome } from '@fortawesome/free-solid-svg-icons';
import * as bootstrap from 'bootstrap';
import { DatabaseService } from 'src/app/services/database/database.service';
import { GlobalService } from 'src/app/services/global.service';
import { AuthService } from '../auth.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
	@ViewChild('toastElement') toastElement!:ElementRef;

	//HTML Form
	form: FormGroup;

	//HTML Elements
	_username!: string;
	_email!: string;
	_password!: string;
	_confirm_password!: string;
	_register_button = document.querySelector('quickstart-sign-up');


	//ICONS
	faEye = faEye;
	faHome = faHome;
	faBars = faBars;
	showHidePassword: string = " Show";
	showHideConfirmPassword: string = " Show";


	//VALIDATION
	_emailIsValid: boolean = false;
	_passwordIsValid: boolean = false;
	terms_privacy_checked: boolean = false;
	isValid: boolean = (
		this._emailIsValid && 
		this._passwordIsValid && 
		this.terms_privacy_checked
	);

	isLoggedIn: boolean = false;

	constructor(
		public authService: AuthService, 
		private formBuilder: FormBuilder,
		private router: Router,
		private database: DatabaseService) {
		this.form = this.formBuilder.group({
				username: ['', [
					Validators.email,
					Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'),
					Validators.required
					]],
				email: ['', [
					Validators.email,
					Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'),
					Validators.required
				]],
				password: ['', [
					Validators.maxLength(20),
					Validators.minLength(8),
					Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$'),
					Validators.required
				]],
				confirm_password: ['', [
					Validators.maxLength(40),
					Validators.minLength(6),
					Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'),
					Validators.required
				]]
		});
	}

	ngOnInit(): void {}

	

	logout() {
		localStorage.clear();
		this.router.navigate(['']);
	}


	public control(fieldname: string) {
		return this.form.get(fieldname);
	}


	validateEmail(fieldname: HTMLInputElement) {
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let emailIsValid =  regex.test(String(fieldname.value).toLowerCase()); //true | false
		let p = (this._username !== null && this._username !== undefined);
		let q = (this._email !== null && this._email !== undefined);

		if (!emailIsValid) {
			document.getElementById('emailToast')?.focus();
			this.showToast(fieldname.value + ' is mal-formed.', 'btn-danger');
			return;
		}
		if (p && q) {
			if (!this.confirmEmailMatch()) {
				this.showToast(this._username + ' and ' + this._email + ' must match.', 'btn-danger');
				return;
			}
			this._emailIsValid = p && q;
		}
		
		this.showToast(fieldname.value + ' is accepted.', 'btn-success');
		this.isSubmitable();
	}


	//Fires onblur.
	confirmEmailMatch(): boolean {
		return (this._username === this._email);
	};


	//Fires onblur.
	confirmPasswordMatch(): void {
		let p = (this._password !== null && this._password !== undefined);
		let q = (this._confirm_password !== null && this._confirm_password !== undefined);

		if ( (this._password !== this._confirm_password) ) {
			this.showToast("Passwords do not match.", "btn-danger");
			return;
		}

		this._passwordIsValid = (p && q);
		this.hide_input_error_messages();
	};


	//User choice - show or hide password during entry.
	togglePasswordVisibility(): void {

		let _password = document.querySelector("#password");
		let _type = _password?.getAttribute('type');

		let _showPasswordEye = document.querySelector('#showPasswordEye');

		if (_type === "password") {
			_password?.removeAttribute('type');
			_password?.setAttribute('type', 'text');
			_showPasswordEye?.setAttribute('style', "color: #00f800");
			this.showHidePassword = " Hide";
		} else {
			_password?.removeAttribute('type');
			_password?.setAttribute('type', 'password');
			_showPasswordEye?.setAttribute('style', "color: #f00");
			this.showHidePassword = " Show";
		}
	};


	//User choice - show or hide confirm password during entry.
	toggleConfirmPasswordVisibility(): void {

		let _confirm_password = document.querySelector("#confirm_password");
		let _type = _confirm_password?.getAttribute('type');

		let _showConfirmPasswordEye = document.querySelector('#showConfirmPasswordEye');

		if (_type === "password") {
			_confirm_password?.removeAttribute('type');
			_confirm_password?.setAttribute('type', 'text');
			_showConfirmPasswordEye?.setAttribute('style', "color: #00f800");
			this.showHideConfirmPassword = " Hide";
		} else {
			_confirm_password?.removeAttribute('type');
			_confirm_password?.setAttribute('type', 'password');
			_showConfirmPasswordEye?.setAttribute('style', "color: #f00");
			this.showHideConfirmPassword = " Show";
		}
	};


	//Set display:none on all error notifications.
	hide_input_error_messages(): void {	
		for (var i = 0; i < document.getElementsByClassName('alert alert-danger').length; i++) {
			document.getElementsByClassName('alert alert-danger')[i].setAttribute('style','display:none')
		}
		this.isSubmitable();
	};


	//Determine the State of the checkbox.
	terms_privacy_changed(selected: any): void {
		this.terms_privacy_checked = (selected.target.checked) ? true : false;
		this.isSubmitable();
	}


	/* TOASTS */
	showToast(message: string, bootstrap_color_class: string) {
		GlobalService.showToast(
			message,
			bootstrap_color_class, 
			this.toastElement.nativeElement.id
		);
	}


	async onSubmit() {
		//If successful, this will create a new account in Firebase.
		//Firebase insert
		await this.authService.SignUp(this._email, this._password)
			.then((data) => {
				//if(!data.user) return;
				
				//this.authenticateUser(data.user);
//				return data.user; //return firebase User
			})
	}
	//is user.email in DB
	authenticateUser(user:any) {
		this.database.getData("users", "emailAddress", user.email)
			.subscribe((response) => {

				if(!response.data) return;

				if (response.data && response.data.length > 0) {
					return { "name": "Error", "message": "User already exists." }
				}

				/* ************************************************/
				//The user does not already exist.
				if (response.data.length === 0) {
					//insert into DB
					this.database.insert({
						"emailAddress": this._email,
						"lastLogin": new Date(), "lastUpdate": Date.now(),
						"message": 'Tell us something about yourself.',
						"role": 2,
						"status": 1,
						"table": 'users'
					})
						.subscribe(() => {
							GlobalService.showToast(
								"User added successfully.",
								"btn-success", 
								this.toastElement.nativeElement.id
							);
							this.router.navigate(['home/signin']);
						}); //end .subscribe
				}
				/* ************************************************/
				return response;
			});
			//returns Observable<any>
	}


	onReset(): void {
		console.log('onReset clicked.');
	}


	isSubmitable() {
		this.isValid = (this._emailIsValid && this._passwordIsValid && this.terms_privacy_checked);
	};


	//Navigate to the sign-in view.
	go(location:string): void {
		window.location.replace ('/' + location);
	};


	//FOR THE COMPONENT
	createToast() {
		console.log("Inside createToast.");
		console.log("toastTrigger just clicked for emailToast.");
		const toastLiveExample = document.getElementById('emailToast');

		var options = {
			animation: true,
			autohide: true,
			delay: 5000
		};
		var toast = new bootstrap.Toast(toastLiveExample!, options);
		toast.show();
	}

}
