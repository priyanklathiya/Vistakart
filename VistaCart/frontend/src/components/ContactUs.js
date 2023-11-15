import React, { useState } from 'react';
import '../css/loginSigup.css';
import Logo from '../images/vistacartlogomini.png';

function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate Name
    if (!/^[a-zA-Z ]+$/.test(name)) {
      setNameError('Please enter a valid name (only characters and spaces)');
    } else {
      setNameError('');
    }

    // Validate Email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }

    // Validate Message
    if (message.trim() === '') {
      setMessageError('Please enter a message to submit the form');
    } else {
      setMessageError('');
    }

    // Check if there are any errors
    if (!nameError && !emailError && !messageError) {
      console.log('Form submitted:', { name, email, subject, message });
      // Add your form submission logic here
    }
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-7">
            <div className="card mt-5">
              <div className="card-body">
                <h5 className="card-title text-center">
                  Send us your concern
                </h5>
                <hr />
                <form onSubmit={handleSubmit}>
                  <div className="mb-3 form-group">
                    <label htmlFor="name" className="form-label card-text">
                      Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${nameError ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      placeholder="Enter your First name and last name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <div className={nameError ? 'invalid-feedback' : 'd-none'}>
                      {nameError}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="text"
                      className={`form-control ${emailError ? 'is-invalid' : ''}`}
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className={emailError ? 'invalid-feedback' : 'd-none'}>
                      {emailError}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">
                      Subject
                    </label>
                    <input
                      type="text"
                      className={`form-control`}
                      placeholder="Enter subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    <textarea
                      className={`form-control ${messageError ? 'is-invalid' : ''}`}
                      placeholder="Enter message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className={messageError ? 'invalid-feedback' : 'd-none'}>
                      {messageError}
                    </div>
                  </div>
                  <button type="submit" className="btn btn-custom">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-sm-3">
            <div className="card mt-5">
              <div className="card-body">
                <h5 className='m-2 text-center'>Contact Us</h5>
                <hr />
                <h5>Address:</h5>
                <p>123, fedrick st, Kitchener, ON - N2M 4G8</p>

                <h5>Phone:</h5>
                <p>1800-333-4444</p>
                <p>1800-333-4444</p>
                <p>1800-333-4444</p>

                <h5>Email:</h5>
                <p>Support: support@vistacart.com</p>
                <p>Sales: sales@vistacart.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
