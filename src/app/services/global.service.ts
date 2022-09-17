import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { HttpHeaders } from '@angular/common/http';
import { UserComponent } from '../components/user/user.component';


@Injectable({
	providedIn: 'root'
})


export class GlobalService {


	constructor() {}


	static User: UserComponent;


	//Http Headers
	static httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
		})
	}


	/* TOASTS */
	//Since the toast is active for only 5 seconds, the close button is unneccessary.
	static closeToast(element:HTMLDivElement) {
		let _element = document.querySelector("#" + element);
		_element?.remove();
	}
	static showToast(
		message:string, 
		bootstrap_color_class:string,
		el:HTMLDivElement
	) {
		let _element = document.querySelector("#" + el);

		const _toast = new bootstrap.Toast(_element!, {
			animation: true,
			autohide: true,
			delay: 5000 //900000
		});

		_element!.innerHTML = message;

		if (bootstrap_color_class === 'btn-danger') {
			_element?.classList.remove('btn-success');
			_element?.setAttribute('style', 'background-color: #dc3545');
		}

		if (bootstrap_color_class === 'btn-success') {
			_element?.classList.remove('btn-danger');
			_element!.setAttribute('style', 'background-color: #198754');
		}

		_toast.show();
	}
	//encode and decode for localStorage.
	//Note: btoa and atob are both deprecated.  Use Buffer.from and Buffer.toString instead
	//Buffer.from(str, 'base64') andbuf.toString('base64')
	static encode(str: string) {
		return btoa(encodeURIComponent(str)
			.replace(
				/%([0-9A-F]{2})/g,
				function toSolidBytes(_match, p1) {
					return String.fromCharCode(Number('0x' + p1));
				}
			)
		);
	}
	static decode(str: string) {
		return decodeURIComponent(
			atob(str)
				.split('')
				.map(function(c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);
	}
	static selectDistinct (dataArray:Array<any>, fieldName:string) {
		const result = [];
		const map = new Map();
		for (const item of dataArray) {
			if(!map.has(item[fieldName])) {
				map.set(item[fieldName], true);
				result.push(item);
			}
		}
		return result;
	};
  
	static match(controlName: string, checkControlName: string): ValidatorFn {
		return (controls: AbstractControl) => {
			const control = controls.get(controlName);
			const checkControl = controls.get(checkControlName);

			if (checkControl!.errors && !checkControl!.errors['matching']) {
				return null;
			}

			if (control!.value !== checkControl!.value) {
				controls.get(checkControlName)!.setErrors({ matching: true });
				return { matching: true };
			} else {
				return null;
			}
		};
	}
}
