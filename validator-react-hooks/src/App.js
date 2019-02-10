import React, { useState } from 'react';
import './App.css';
import { Validator } from './validator';

const MINIMUM_PASSWORD_LENGTH = 6
// from https://emailregex.com/
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const App = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [firstNameRequiredValid, setFirstNameRequiredValid] = useState(true)
  const [lastNameRequiredValid, setLastNameRequiredValid]= useState(true)
  const [emailRequiredValid, setEmailRequiredValid] = useState(true)
  const [emailRegexValid, setEmailRegexValid] = useState(true)
  const [passwordRequiredValid, setPasswordRequiredValid] = useState(true)
  const [passwordLengthValid, setPasswordLengthValid] = useState(true)
  const [verifyPasswordRequiredValid, setVerifyPasswordRequiredValid] = useState(true)
  const [verifyPasswordMatchesValid, setVerifyPasswordMatchesValid] = useState(true)
  const validator = new Validator({
    firstNameRequired: () => !!firstName,
    lastNameRequired: () => !!lastName,
    emailRequired: () => !!email,
    emailRegex: () => !email || !!email.match(EMAIL_REGEX),
    passwordRequired: () => !!password,
    passwordLength: () => !password || password.length >= MINIMUM_PASSWORD_LENGTH,
    verifyPasswordRequired: () => !!verifyPassword,
    verifyPasswordMatches: () => !verifyPassword || verifyPassword === password
  })

  function handleFirstNameChanged(e) {
    setFirstName(e.target.value)
    setFirstNameRequiredValid(validator.validateFirstNameRequired())
  }

  function handleLastNameChanged(e) {
    setLastName(e.target.value)
    setLastNameRequiredValid(validator.validateLastNameRequired())
  }

  function handleEmailChanged(e) {
    setEmail(e.target.value)
    setEmailRequiredValid(validator.validateEmailRequired())
    setEmailRegexValid(validator.validateEmailRegex())
  }

  function handlePasswordChanged(e) {
    setPassword(e.target.value)
    setPasswordRequiredValid(validator.validatePasswordRequired())
    setPasswordLengthValid(validator.validatePasswordLength())
  }

  function handleVerifyPasswordChanged(e) {
    setVerifyPassword(e.target.value)
    setVerifyPasswordRequiredValid(validator.validateVerifyPasswordRequired())
    setVerifyPasswordMatchesValid(validator.validateVerifyPasswordMatches)
  }

  function submit(e) {
    e.preventDefault()

    validator.validateForm()
    setFirstNameRequiredValid(validator.firstNameRequiredValid)
    setLastNameRequiredValid(validator.lastNameRequiredValid)
    setEmailRequiredValid(validator.emailRequiredValid)
    setEmailRegexValid(validator.emailRegexValid)
    setPasswordRequiredValid(validator.passwordRequiredValid)
    setPasswordLengthValid(validator.passwordLengthValid)
    setVerifyPasswordRequiredValid(validator.verifyPasswordRequiredValid)
    setVerifyPasswordMatchesValid(validator.verifyPasswordMatchesValid)

    if (!validator.formValid) return

    alert('Submitting form')
    console.log({
      firstName,
      lastName,
      email,
      password,
      verifyPassword
    })
  }

  return (
    <div className="container">
      <h1>Validator React Hooks testbed</h1>
      <form onSubmit={e => submit(e)}>
        <div className="form-row">
          <label htmlFor="firstName">First name</label>
          <input type="text" className="form-control" id="firstName"
            placeholder="First name"
            onChange={e => handleFirstNameChanged(e)}/>
          {firstNameRequiredValid || <small className="form-text text-muted">Please provide your first name</small>}
        </div>
        <div className="form-row">
          <label htmlFor="lastName">Last name</label>
          <input type="text" className="form-control" id="lastName"
            placeholder="Last name"
            onChange={e => handleLastNameChanged(e)}/>
          {lastNameRequiredValid || <small className="form-text text-muted">Please provide your last name</small>}
        </div>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input type="email" className="form-control" id="email"
            placeholder="Email"
            onChange={e => handleEmailChanged(e)}/>
          {emailRequiredValid || <small className="form-text text-muted">Please provide your email</small>}
          {emailRegexValid || <small className="form-text text-muted">Please provide a valid email</small>}
        </div>
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password"
            placeholder="Password"
            onChange={e => handlePasswordChanged(e)}/>
          {passwordRequiredValid || <small className="form-text text-muted">Please provide your password</small>}
          {passwordLengthValid || <small className="form-text text-muted">Your password must be at least {MINIMUM_PASSWORD_LENGTH} characters</small>}
        </div>
        <div className="form-row">
          <label htmlFor="verifyPassword">Verify password</label>
          <input type="password" className="form-control" id="verifyPassword"
            placeholder="Verify password"
            onChange={e => handleVerifyPasswordChanged(e)}/>
            {verifyPasswordRequiredValid || <small className="form-text text-muted">Please verify your password</small>}
            {verifyPasswordMatchesValid || <small className="form-text text-muted">The passwords must match</small>}
        </div>
        <br/>
        <div className="form-row">
          <button className="btn btn-primary" type="submit">Submit form</button>
        </div>
      </form>
    </div>
    )
}

export default App;
