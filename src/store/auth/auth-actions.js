import { REGISTER, LOGIN_WITH_EMAIL, CHECK_LOADING, CHECK_ERROR, LOGIN_SUCCESS, REGISTER_SUCCESS } from '../actionTypes'
import { auth } from '../../firebase/index'
import { AsyncStorage } from 'react-native'

export const loginwithEmail = (email, password, cb) => {
  return async dispatch => {
    dispatch(loading())
    try {
      const user = await auth.signInWithEmailAndPassword(email.trim().toLowerCase(), password)
      const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true)
      await AsyncStorage.setItem('idToken', idToken)
      dispatch(loginSucces(idToken))
      cb()
    } catch (err) {
      dispatch(checkErr(err))
    }
  }
}

export const registerwithEmail = (username, email, password, cb) => {
  return async dispatch => {
    dispatch(loading())
    try {
      await auth.createUserWithEmailAndPassword(email.trim().toLocaleLowerCase(), password)
      const user = auth.currentUser
      user.updateProfile({
        displayName: username
      })
      dispatch({
        type: REGISTER_SUCCESS
      })
      cb()
    } catch (err) {
      dispatch(checkErr(err))
    }
  }
}

function loginSucces (payload) {
  return {
    type: LOGIN_SUCCESS,
    payload
  }
}

function loading() {
  return {
    type: CHECK_LOADING
  }
}

function checkErr(payload) {
  return {
    type: CHECK_ERROR,
    payload
  }
}
