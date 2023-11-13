import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/loginSigup.css';
import Logo from '../images/vistacartlogomini.png';
import axios from "axios";

function Login() {
  const [formErrors, setFormErrors] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const history = useNavigate();

  const validateEmail = (email) => {
    // Regular expression for a valid email address
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const loginEvent = (e) => {
    e.preventDefault();
    const formErrors = {
      email: !validateEmail(email),
      password: !password,
    };

    setIsSuccess(false);
    setFormErrors({ ...formErrors });

    if (Object.values(formErrors).some((v) => v)) return;

    let userData = {
      email: email,
      password: password
    }

    axios.defaults.withCredentials = true;

    axios.post("http://localhost:8080/api/users/login", userData)
      .then((response) => {
        window.scrollTo(0, 0);
        if (response.status === 200) {
          if (response.data.status === 1) {
            setIsSuccess(true);
            setIsFailed(false);

            setSuccessMsg(response.data.msg);
            setEmail("");
            setPassword("");

            if (response.data.userType == 2) {
              window.location.href = '/';
            } else if (response.data.userType == 3) {
              window.location.href = '/adminDashboard';
            } else {
              window.location.href = '/';
            }
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

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4">
            {isFailed && (
              <div className="alert alert-danger mt-3" role="alert">
                <b>Failed!</b> {successMsg}
              </div>
            )}
            <div className="card mt-5">
              <div className="card-body">
                <h5 className="card-title text-center">
                  VISTACART
                </h5>
                <hr />
                <form onSubmit={loginEvent}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="text"
                      className={`form-control ${formErrors && (formErrors?.email ? "is-invalid" : "is-valid")}`}
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => { setEmail(e.currentTarget.value); }}
                      placeholder="Enter your email" />
                    {formErrors && formErrors.email && (
                      <div className="invalid-feedback text-danger">Please enter a valid email</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password"
                      className={`form-control ${formErrors && (formErrors?.password ? "is-invalid" : "is-valid")}`}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => { setPassword(e.currentTarget.value); }}
                      placeholder="Enter your password" />
                    {formErrors && formErrors.password && (
                      <div className="invalid-feedback text-danger">Please enter a password</div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-custom">Login</button>
                </form>
                <div className="mt-3">
                  <p>Don't have an account?  <Link to="/Signup" className="login-link">Sign Up</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
