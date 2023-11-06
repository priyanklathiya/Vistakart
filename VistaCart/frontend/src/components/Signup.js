import React, { useState } from 'react';
import '../css/loginSigup.css';
import Logo from '../images/vistacartlogomini.png'; 
import axios from "axios";
function Signup() {
  
  const [formErrors, setFormErrors] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");


  
  const handleFormSubmit = (e) => {
     e.preventDefault();
    const formErrors = {
      firstName: !firstName,
      lastName: !lastName,
      phone: !phone,
      email: !email,
      password: !password,
      retypePassword: !retypePassword || password !== retypePassword,
    };
    
    setIsSuccess(false);
    setIsFailed(false);
    setFormErrors({ ...formErrors });

    if (Object.values(formErrors).some((v) => v)) return;

    let userData = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      password: password,
      userType: "customer"
    }


    axios.post("http://localhost:8080/api/users/addUser", userData)
      .then((response) => {
        window.scrollTo(0, 0);
        // console.log(response);
        if (response.status === 200) {
          if (response.data.status === 1) {
          // alert('Account created successfully.');
            setIsSuccess(true);
            setIsFailed(false);
            
            setSuccessMsg(response.data.msg);
            setFirstName("");
            setLastName('');
            setPhone("");
            setEmail("");
            setPassword("");
            setRetypePassword("");
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
    })

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
                <h5 className="card-title text-center">
                  VISTACART
                            {/* <img className="logo" src={Logo} alt="Vista cart Logo" /> Vistacart */}
                        </h5>
                        <hr />
                      <form onSubmit={handleFormSubmit}>
                        <div className="mb-3">
                          <label htmlFor="firstName" className="form-label">First Name</label>
                          <input type="text" 
                            className={`form-control ${formErrors && (formErrors?.firstName ? "is-invalid" : "is-valid")}`}
                            id="firstName"
                            name="firstName"
                            value={firstName}
                            onChange={(e) => {setFirstName(e.currentTarget.value);}}
                            placeholder="Enter your first name" />
                        
                          <div className="invalid-feedback text-white">Please enter correct First Name</div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="lastName" className="form-label">Last Name</label>
                          <input type="text"
                            className={`form-control ${formErrors && (formErrors?.lastName ? "is-invalid" : "is-valid")}`}
                            id="lastName"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => {setLastName(e.currentTarget.value);}}
                            placeholder="Enter your last name" />
                          <div className="invalid-feedback text-white">Please enter correct Last Name</div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="phone" className="form-label">Phone Number</label>
                          <input type="text"
                            className={`form-control ${formErrors && (formErrors?.phone ? "is-invalid" : "is-valid")}`}
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => {setPhone(e.currentTarget.value);}}
                            placeholder="Enter your phone number" />
                          <div className="invalid-feedback text-white">Please enter correct Mobile Number</div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input type="text"
                            className={`form-control ${formErrors && (formErrors?.email ? "is-invalid" : "is-valid")}`}
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => { setEmail(e.currentTarget.value); }}
                            placeholder="Enter your email" />
                          <div className="invalid-feedback text-white">Please enter correct Email</div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">Password</label>
                          <input type="password"
                            className={`form-control ${formErrors && (formErrors?.password ? "is-invalid" : "is-valid")}`}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => {setPassword(e.currentTarget.value);}}
                            placeholder="Enter your password" />
                          <div className="invalid-feedback text-white">Please enter Password</div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="retypePassword" className="form-label">Retype Password</label>
                          <input type="password"
                            className={`form-control ${formErrors && (formErrors?.retypePassword ? "is-invalid" : "is-valid")}`}
                            id="retypePassword"
                            name="retypePassword"
                            value={retypePassword}
                            onChange={(e) => { setRetypePassword(e.currentTarget.value); }}
                            placeholder="Retype your password" />
                          <div className="invalid-feedback text-white">Password does not match</div>
                        </div>
                        <button type="submit" className="btn btn-custom">Sign Up</button>
                      </form>
                      <div className="mt-3">
                        <p>Already have an account? <a href="/login">Login here</a></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
  )
}

export default Signup