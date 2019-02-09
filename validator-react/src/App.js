import React, { Component } from 'react';
import './App.css';
import { Validator } from './validator'

class App extends Component {
  constructor(props, context) {
    super(props, context)
  
    this.state = {
      firstName: '',
      lastName: '',
      validator: new Validator({
        firstNameRequired: state => !!state.firstName,
        lastNameRequired: state => !!state.lastName,
      })
    }
  }

  handleFirstNameChanged(e) {
    const firstName = e.target.value

    this.setState(state => {
      state.firstName = firstName
      state.validator.validateFirstNameRequired(state)
    })
  }

  handleLastNameChanged(e) {
    const lastName = e.target.value

    this.setState(state => {
      state.lastName = lastName
      state.validator.validateLastNameRequired(state)
    })
  }

  handleSubmit(e) {
    e.preventDefault()

    this.setState(
      state => state.validator.validateForm(state),
      () => {
        if (!this.state.validator.formValid) return

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
            {this.state.validator.firstNameRequiredValid || <div>Please provide your first name</div>}
          </div>
          <div className="form-row">
            <label htmlFor="lastName">Last name</label>
            <input type="text" className="form-control" id="firstName"
             placeholder="Last name"
             onChange={e => this.handleLastNameChanged(e)}/>
             {this.state.validator.lastNameRequiredValid || <div>Please provide your last name</div>}
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
