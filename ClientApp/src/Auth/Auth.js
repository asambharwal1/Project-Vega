// src/Auth/Auth.js

import history from '../history';
import auth0 from 'auth0-js';

// ...
export default class Auth {
  accessToken;
  idToken;
  expiresAt;
  userProfile;

  auth0 = new auth0.WebAuth({
    domain: 'projvega.auth0.com',
    clientID: '%CLIENT_ID%',
    redirectUri: 'https://localhost:44303/callback',
    responseType: 'token id_token',
    audience: 'https://api.vega.com',
    scope: 'openid email profile'
  });

  login() {
    this.auth0.authorize();
  }

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        history.replace('/');
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  setProfile = (profile) => {
    this.userProfile = profile;
  }

  getProfile() {
    this.auth0.client.userInfo(this.accessToken, (err, profile) => {
      localStorage.setItem('userProfile', JSON.stringify(profile))
      this.setProfile(profile);
    });
  }

  getProfileName() {
    return this.userProfile;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
    this.getProfile();
    // navigate to the home route
    history.replace('/');
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.logout();
         alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
       }
    });
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;
    this.userProfile = null;
    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
    // navigate to the home route
    window.open("https://projvega.auth0.com/v2/logout?returnTo="+encodeURI("https://localhost:44303"), "_self");
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }
}