import React, { useState } from 'react';
import '../css/loginSigup.css'; // Ensure this path matches your CSS file
import Logo from '../images/vistacartlogomini.png'; // Make sure this path matches your image
import axios from 'axios';

function Signup() {
  const [formErrors, setFormErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isPasswordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[!@#$%^&*]/.test(password);

  const isPasswordMatch = password === retypePassword;

  const getStrength = () => {
    if (!password) return 0;
    if (password.length >= 8 && isPasswordValid) return 3;
    return 1;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newFormErrors = {};

    if (!firstName) {
      newFormErrors.firstName = 'Please enter your First Name';
    }

    if (!lastName) {
      newFormErrors.lastName = 'Please enter your Last Name';
    }

    if (!phone) {
      newFormErrors.phone = 'Please enter your Mobile Number';
    }

    if (!email) {
      newFormErrors.email = 'Please enter your Email';
    }

    if (!/^[a-zA-Z]*$/.test(firstName)) {
      newFormErrors.firstName = 'First Name should contain only characters.';
    }

    if (!/^[a-zA-Z]*$/.test(lastName)) {
      newFormErrors.lastName = 'Last Name should contain only characters.';
    }

    if (!/^\d{10}$/.test(phone)) {
      newFormErrors.phone = 'Phone number should contain 10 digits only.';
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      newFormErrors.email = 'Please enter a valid email address.';
    }

    if (!isPasswordValid || !password) {
      newFormErrors.password =
        'Password must be at least 8 characters and contain an uppercase letter, a lowercase letter, and a special character';
    }

    if (!isPasswordMatch || !retypePassword) {
      newFormErrors.retypePassword = 'Password does not match';
    }

    setFormErrors(newFormErrors);

    if (Object.keys(newFormErrors).length > 0) {
      return;
    }

    let userData = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      password: password,
      userType: 'customer',
    };

    axios
      .post('http://localhost:8080/api/users/addUser', userData)
      .then((response) => {
        window.scrollTo(0, 0);
        if (response.status === 200) {
          if (response.data.status === 1) {
            setIsSuccess(true);
            setIsFailed(false);
            setSuccessMsg(response.data.msg);
            setFirstName('');
            setLastName('');
            setPhone('');
            setEmail('');
            setPassword('');
            setRetypePassword('');
          } else {
            setIsSuccess(false);
            setIsFailed(true);
            setSuccessMsg(response.data.msg);
          }
        } else {
          setIsSuccess(false);
          setIsFailed(true);
          setSuccessMsg('Something went wrong. Please try again later!');
        }
      });
  };

  const getPasswordColor = () => {
    const strength = getStrength();
    if (strength === 1) {
      return 'red';
    } else if (strength === 3) {
      return 'green';
    }
    return 'yellow';
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4">
            {isSuccess && (
              <div className="alert alert-success mt-3" role="alert">
                <b>Success!</b> {successMsg}
              </div>
            )}

            {isFailed && (
              <div className="alert alert-danger mt-3" role="alert">
                <b>Failed!</b> {successMsg}
              </div>
            )}
            <div className="card mt-5">
              <div className="card-body">
                <h5 className="card-title text-center">VISTACART</h5>
                <hr />
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                      id="firstName"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.currentTarget.value)}
                      placeholder="Enter your first name"
                    />
                    {formErrors.firstName && (
                      <div className="invalid-feedback text-danger">{formErrors.firstName}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                      id="lastName"
                      name="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.currentTarget.value)}
                      placeholder="Enter your last name"
                    />
                    {formErrors.lastName && (
                      <div className="invalid-feedback text-danger">{formErrors.lastName}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                      id="phone"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.currentTarget.value)}
                      placeholder="Enter your phone number"
                    />
                    {formErrors.phone && (
                      <div className="invalid-feedback text-danger">{formErrors.phone}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.currentTarget.value)}
                      placeholder="Enter your email"
                    />
                    {formErrors.email && (
                      <div className="invalid-feedback text-danger">{formErrors.email}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.currentTarget.value)}
                      placeholder="Enter your password"
                    />
                    {formErrors.password && (
                      <div className="invalid-feedback text-danger">{formErrors.password}</div>
                    )}
                  </div>
                  <div className="password-strength">
                    <label style={{ color: 'grey' }}>Password Strength</label>
                    <br />
                    <progress
                      max="3"
                      value={getStrength()}
                      style={{ color: getPasswordColor() }}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="retypePassword" className="form-label">
                      Retype Password
                    </label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.retypePassword ? 'is-invalid' : ''}`}
                      id="retypePassword"
                      name="retypePassword"
                      value={retypePassword}
                      onChange={(e) => setRetypePassword(e.currentTarget.value)}
                      placeholder="Retype your password"
                    />
                    {formErrors.retypePassword && (
                      <div className="invalid-feedback text-danger">{formErrors.retypePassword}</div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-custom">
                    Sign Up
                  </button>
                </form>
                <div className="mt-3">
                  <p>
                    Already have an account? <a href="/login">Login here</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
