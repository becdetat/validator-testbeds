import React, { Component } from 'react';
import './App.css';
import { Validator } from './validator'

const MINIMUM_PASSWORD_LENGTH = 6
// from https://emailregex.com/
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class App extends Component {
  constructor(props, context) {
    super(props, context)
  
    this.state = {
      firstName: '',
      firstNameRequiredValid: true,
      lastName: '',
      lastNameRequiredValid: true,
      password: '',
      passwordRequiredValid: true,
      passwordLengthValid: true,
      email: '',
      emailRequiredValid: true,
      emailRegexValid: true,
      verifyPassword: '',
      verifyPasswordRequiredValid: true,
      verifyPasswordMatchesValid: true
    }
    this.validator = new Validator({
      firstNameRequired: state => !!state.firstName,
      lastNameRequired: state => !!state.lastName,
      passwordRequired: state => !!state.password,
      passwordLength: state => !state.password || state.password.length >= MINIMUM_PASSWORD_LENGTH,
      emailRequired: state => !!state.email,
      emailRegex: state => !state.email || !!state.email.match(EMAIL_REGEX),
      verifyPasswordRequired: state => !!state.verifyPassword,
      verifyPasswordMatches: state => !state.verifyPassword || state.verifyPassword === state.password
    })
  }

  handleFirstNameChanged(e) {
    const firstName = e.target.value

    this.setState(state => {
      state.firstName = firstName
      state.firstNameRequiredValid = this.validator.validateFirstNameRequired(state)

      return state
    })
  }

  handleLastNameChanged(e) {
    const lastName = e.target.value

    this.setState(state => {
      state.lastName = lastName
      state.lastNameRequiredValid = this.validator.validateLastNameRequired(state)

      return state
    })
  }

  handlePasswordChanged(e) {
    const password = e.target.value

    this.setState(state => {
      state.password = password
      state.passwordRequiredValid = this.validator.validatePasswordRequired(state)
      state.passwordLengthValid = this.validator.validatePasswordLength(state)

      return state
    })
  }

  handleEmailChanged(e) {
    const email = e.target.value

    this.setState(state => {
      state.email = email
      state.emailRequiredValid = this.validator.validateEmailRequired(state)
      state.emailRegexValid = this.validator.validateEmailRegex(state)

      return state
    })
  }

  handleVerifyPasswordChanged(e) {
    const verifyPassword = e.target.value

    this.setState(state => {
      state.verifyPassword = verifyPassword
      state.verifyPasswordRequiredValid = this.validator.validateVerifyPasswordRequired(state)
      state.verifyPasswordMatchesValid = this.validator.validateVerifyPasswordMatches(state)

      return state
    })
  }

  handleSubmit(e) {
    e.preventDefault()

    this.setState(
      state => this.validator.validateForm(state),
      () => {
        if (!this.validator.formValid) return

        alert('Submitting form')
        console.log(this.state)
      }
    )
  }

  render() {
    return (
      <div className="container">
        <h1>Validator React testbed</h1>
        <form onSubmit={e => this.handleSubmit(e)}>
          <div className="form-row">
            <label htmlFor="firstName">First name</label>
            <input type="text" className="form-control" id="firstName"
              placeholder="First name"
              onChange={e => this.handleFirstNameChanged(e)} />
            {this.state.firstNameRequiredValid || <small className="form-text text-muted">Please provide your first name</small>}
          </div>
          <div className="form-row">
            <label htmlFor="lastName">Last name</label>
            <input type="text" className="form-control" id="lastName"
             placeholder="Last name"
             onChange={e => this.handleLastNameChanged(e)}/>
             {this.state.lastNameRequiredValid || <small className="form-text text-muted">Please provide your last name</small>}
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email"
              placeholder="Email"
              onChange={e => this.handleEmailChanged(e)}/>
            {this.state.emailRequiredValid || <small className="form-text text-muted">Please provide your email</small>}
            {this.state.emailRegexValid || <small className="form-text text-muted">Please provide a valid email</small>}
          </div>
          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password"
              placeholder="Password"
              onChange={e => this.handlePasswordChanged(e)}/>
            {this.state.passwordRequiredValid || <small className="form-text text-muted">Please provide your password</small>}
            {this.state.passwordLengthValid || <small className="form-text text-muted">Your password must be at least {MINIMUM_PASSWORD_LENGTH} characters</small>}
          </div>
          <div className="form-row">
            <label htmlFor="verifyPassword">Verify password</label>
            <input type="password" className="form-control" id="verifyPassword"
              placeholder="Verify password"
              onChange={e => this.handleVerifyPasswordChanged(e)}/>
              {this.state.verifyPasswordRequiredValid || <small className="form-text text-muted">Please verify your password</small>}
              {this.state.verifyPasswordMatchesValid || <small className="form-text text-muted">The passwords must match</small>}
          </div>
          <br/>
          <div className="form-row">
            <button className="btn btn-primary" type="submit">Submit form</button>
          </div>
        </form>
      </div>
    );
  }
}

export default App;
