import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	userData: any //Save logged in user data

	constructor(
		public afs: AngularFirestore, //Inject Firestoree auth service
		public afAuth: AngularFireAuth, //Inject Firebase auth service
		public angularFireAuth: AngularFireAuth,
		public router: Router,
		public ngZone: NgZone, //NgZone service to remove outside scope warning
	) {
		/* Saving user data in localstorage when 
		logged in and setting up null when logged out */
		this.afAuth.authState.subscribe((user) => {

			if (user) {
				this.userData = user;

				localStorage.setItem("user", GlobalService.encode(JSON.stringify(this.userData)));
			} else {
				localStorage.setItem('user', 'null');
			}
		}); 
	}

	/* Sign in */
	SignIn(email: string, password: string) {
		return this.angularFireAuth.signInWithEmailAndPassword(String(email), String(password));
	}


	// Sign up with email/password
	async SignUp(email: string, password: string) {
		debugger;
		try {
			const result = await this.afAuth
				.createUserWithEmailAndPassword(email, password);
				debugger;
			/* Call the SendVerificaitonMail() function when new user sign
			up and returns promise */
			this.SendVerificationMail();
			this.SetUserData(result.user);
		} catch (error) {
			//window.alert(error.message);
		}
	}

	// Sign out
	SignOut() {
		return this.afAuth.signOut().then(() => {
			localStorage.removeItem('user');
			this.router.navigate(['sign-in']);
		});
	}

	// Send email verfificaiton when new user sign up
	async SendVerificationMail() {
		let testvalue = this.afAuth.currentUser;
		console.log("testvalue: " + testvalue);
		debugger;
		return this.afAuth.currentUser
			.then((u: any) => {
				debugger;
				u.sendEmailVerification()
			})
			.then((xf:any) => {
				debugger;
				this.router.navigate(['verify-email-address']);
			});
	}

	// Reset Forggot password
	async ForgotPassword(passwordResetEmail: string) {
		return this.afAuth
			.sendPasswordResetEmail(passwordResetEmail)
			.then(() => {
				window.alert('Password reset email sent, check your inbox.');
			})
			.catch((error) => {
				window.alert(error);
			});
	}

	// Returns true when user is looged in and email is verified
	get isLoggedIn(): any {

		try {
			let user:any = null;

			let temp:any = localStorage.getItem("user");

			if (temp !== null) {
				user = JSON.parse(GlobalService.decode(temp));
				user.emailVerified = true;
			}

			return user !== null && user.emailVerified !== false ? true : false;
		} catch(Error: any) {
			return Error;
		}

	}

	// Sign in with Google
	async GoogleAuth() {
		return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
			if (res) {
				this.router.navigate(['dashboard']);
			}
		});
	}

	// Auth logic to run auth providers
	async AuthLogin(provider: any) {
		return this.afAuth
			.signInWithPopup(provider)
			.then((result) => {
				this.ngZone.run(() => {
				this.router.navigate(['dashboard']);
			});
			this.SetUserData(result.user);
		})
		.catch((error) => {
			window.alert(error);
		});
	}

	SetUserData(user: any) {

		const userRef: AngularFirestoreDocument<any> = this.afs.doc(
			`users/${user.uid}`
		);

		const userData: User = {
			uid: user.uid,
			emailAddress: user.email,
			displayName: user.displayName,
			photoURL: user.photoURL,
			emailVerified: user.emailVerified,
		};

		return userRef.set(userData, {
			merge: true,
		});
	}
}
