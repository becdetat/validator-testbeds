/*
The validator is framework-agnostic but it works well with React by sitting in the state.
Usage in React:
class MyComponent extends React.Component {
	constructor(props, context) {
		super(props, context)
		
		// It lives in state (validation rules create properties and helper methods inside the validator):
		this.state = {
			validator: new Validator({
				passwordRequired: state => !!state.password,
				passwordCorrectLength: state => !state.password || state.password.length >= MINIMUM_PASSWORD_LENGTH,
				verifyPasswordRequired: state => !!state.verifyPassword,
				passwordsMustMatch: state => !!state.password || !state.verifyPassword || state.password == state.verifyPassword,
			})
		}
		
		render() {
			// It creates properties like 'passwordRequiredValid' when rules are added
			const passwordValid = this.state.validator.passwordRequiredValid && this.state.validator.passwordCorrectLengthValid
			const verifyPasswordValid = this.state.validator.verifyPasswordRequiredValid && this.state.validator.passwordsMustMatchValid
			
			// It gets used to display validation messages:
			return (
				<form>
					<p className={`form-group ${passwordValid || 'has-error'}`}>
						<input type="password" onChange={(e) => this.handlePasswordChange(e)}/>
						{this.state.validator.passwordRequiredValid || <span className="help">Password is required</span>}
						{this.state.validator.passwordCorrectLengthValid || <span className="help">Password must be at least 8 characters long</span>}
					</p>
					<p className={`form-group ${verifyPasswordValid || 'has-error'}`}>
						<input type="password" onChange={(e) => this.handleVerifyPasswordChange(e)}/>
						{this.state.validator.verifyPasswordRequiredValid || <span className="help">Verify password is required</span>}
						{this.state.validator.passwordsMustMatchValid || <span className="help">Passwords must match</span>}
					</p>
					<p className="form-group">
						<button onClick={() => this.handleSubmit()>Submit</button>
					</p>
				</form>
			)
		}
		
		handlePasswordChange(e) {
			const password = e.target.value
			
			this.setState(state => {
				state.password = password
				// It creates validate methods to call the rule and update the related 'Valid' property
				state.validator.validatePasswordRequired(state)
				state.validator.validatePasswordCorrectLength(state)
				state.validator.validatePasswordsMustMatch(state)
			})
		}
		
		handleVerifyPasswordChange(e) {
			const verifyPassword = e.target.value
			
			this.setState(state => {
				state.verifyPassword = verifyPassword
				state.validator.validateVerifyPasswordRequired(state)
				state.validator.validatePasswordsMustMatch(state)
			})
		}
		
		handleSubmit() {
			// Initially all fields are marked as valid, this validates the entire form
			this.setState(
				state => state.validator.validateForm(state),
				() => {
					if (!this.state.validator.formValid) return
					
					api.submit({ password: this.state.password })
				})
		}
	}
}
*/

export class Validator {
    constructor(
      rules = {},
      config = {}
    ) {
      this.rules = rules
      this.config = config || {}
      this.config.onFieldRevalidated = this.config.onFieldRevalidated || (() => {})
      this.config.onValidationChanged = this.config.onValidationChanged || (() => {})
  
      this.formValid = true
      this.formHasBeenValidated = false
      Object.keys(rules)
        .forEach(fieldName => this._setUpRule(fieldName))
    }
  
    validateForm(state) {
      this.formHasBeenValidated = true
      this.formValid = Object.keys(this.rules)
        .reduce(
          (aggregate, current) => this._setFieldValidation(state, current) && aggregate,
          true
        )
  
      return this.getValidations()
    }
  
    resetValidation() {
      this.formValid = true
      this.formHasBeenValidated = false
      Object.keys(this.rules)
        .forEach(fieldName => this._setUpRule(fieldName))
      this.config.onFieldRevalidated()
    }
  
    addRule(key, rule) {
      this.rules[key] = rule
      this._setUpRule(key)
    }
  
    addRules(newRules) {
      Object.keys(newRules)
        .forEach(x => this.addRule(x, newRules[x]))
    }
  
    removeRule(key) {
      delete this.rules[key]
      delete this[key + 'Valid']
      delete this[key + 'ReallyValid']
      delete this['validate' + key.charAt(0).toUpperCase() + key.slice(1)]
    }
  
    _setUpRule(fieldName) {
      this[fieldName + 'Valid'] = true
      this[fieldName + 'ReallyValid'] = false
      this['validate' + fieldName.charAt(0).toUpperCase() + fieldName.slice(1)] = state => this.validate(state, fieldName)
    }
  
    _setFieldValidation(state, fieldName) {
      const previouslyValid = this[`${fieldName}Valid`]
      const reallyValid = this.rules[fieldName](state)
  
      this[fieldName + 'ReallyValid'] = reallyValid
      this[`${fieldName}Valid`] = !this.formHasBeenValidated || reallyValid
  
      if (previouslyValid !== this[`${fieldName}Valid`]) {
        this.config.onValidationChanged(fieldName)
      }
  
      return reallyValid
    }
  
    validate(state, fieldName) {
      if (!this.formValid) {
        this.validateForm(state)
      } else {
        this._setFieldValidation(state, fieldName)
      }
      this.config.onFieldRevalidated()
  
      return this[`${fieldName}Valid`]
    }
  
    getValidations() {
      return Object.keys(this.rules).reduce(
        (aggregate, current) => {
          aggregate[`${current}Valid`] = this[`${current}Valid`]
  
          return aggregate
        },
        {
          formValid: this.formValid
        })
    }
  }
  
  