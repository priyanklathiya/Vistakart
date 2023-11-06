import React from 'react';
import '../css/footer.css';

function footer() {
  return (
      
    <footer>
      <div className="column">
        <h2>FIND A STORE </h2>
        <h2>JOURNAL</h2>
        <h2>BECOME A MEMBER</h2>
        <h2>FEEDBACK</h2>
        <h2>PROMOCODE</h2>
      </div>

      <div className="column">
        <h2>GET HELP</h2>
        <p>Order Status</p>
        <p>Shipping and Delivery</p>
        <p>Returns</p>
        <p>Payment Options</p>
        <p>Contact Us</p>
      </div>

      <div className="column">
        <h2>QUICK LINKS</h2>
        <p>Terms and Conditions</p>
        <p>Company Details</p>
        <p>Privacy & Cookie Policy</p>
        <p>Cookie Settings</p>
      </div>
      
      <div className="column">
        <h2>FOLLOW US</h2>
        <p>Instagram</p>
        <p>Meta</p>
        <p>X</p>
        <p>Youtube</p>
      </div>
    </footer>
    
  )
}

export default footer