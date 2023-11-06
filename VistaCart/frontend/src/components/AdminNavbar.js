import React from 'react'
import { Link, Outlet } from 'react-router-dom';
import '../css/admindashboard.css';
function AdminNavbar() {
  return (
      <>
          
         <div className='admin-sidebar'>
      <ul>
        <li>
          <Link to="/Categories">
            Categories
          </Link>
        </li>
        <li>
          <Link to="/SubCategories">
            Sub-Categories
          </Link>
        </li>
        <li>
          <Link to="/Brands">
            Brands
          </Link>
        </li>
        <li>
          <Link to="/Products">
            Products
          </Link>
        </li>
      </ul>
    </div>

    </>
  )
}

export default AdminNavbar