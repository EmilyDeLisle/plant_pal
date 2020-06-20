import firebase, { auth, User } from 'firebase/app'
import 'firebase/auth'

export default class AuthenticationManager {
  static instance: AuthenticationManager
  auth: auth.Auth

  /**
   * Get an instance of AuthenticationManager.
   * @returns {AuthenticationManager}
   *  Instance of AuthenticationManager
   */
  static getInstance() {
    if (!AuthenticationManager.instance) {
      AuthenticationManager.instance = new AuthenticationManager()
    }
    return AuthenticationManager.instance
  }

  constructor() {
    if (AuthenticationManager.instance) {
      throw new Error('AuthenticationManager is a singleton class')
    }
    this.auth = firebase.auth()
  }

  signUp(
    email: string,
    password: string,
    onSuccess?: (value: auth.UserCredential) => void | PromiseLike<void>,
    onError?: (reason: any) => PromiseLike<never>
  ) {
    this.auth.createUserWithEmailAndPassword(email, password).then(onSuccess).catch(onError)
  }

  signIn(
    email: string,
    password: string,
    onSuccess?: (value: auth.UserCredential) => void | PromiseLike<void>,
    onError?: (reason: any) => PromiseLike<never>
  ) {
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then((userCred) => {
        // if (onSuccess) {
        //   let authObj = {
        //     type: userCred.operationType,
        //     additional: userCred.additionalUserInfo,
        //     userName: userCred.user.displayName,
        //     email: userCred.email,
        //   };
        //   onSuccess(authObj);
        // }
      })
      .catch(onError)
  }

  signOut(
    onSuccess?: (value: void) => void | PromiseLike<void>,
    onError?: (reason: any) => PromiseLike<never>
  ) {
    this.auth.signOut().then(onSuccess).catch(onError)
  }

  setAuthPersistence(
    onSuccess?: (value: void) => void | PromiseLike<void>,
    onError?: (reason: any) => PromiseLike<never>
  ) {
    this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(onSuccess).catch(onError)
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser
  }

  resetPassword(
    email: string,
    onSuccess: (value: void) => void | PromiseLike<void>,
    onError: (reason: any) => PromiseLike<never>
  ) {
    this.auth.sendPasswordResetEmail(email).then(onSuccess).catch(onError)
  }
}
