import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

function ViewProduct() {
  return (
    <>
      <h1 className='text-center m-5'>Products</h1>

      <div className='container mt-5 mb-5'>
        <Link to="/AddUpdateProduct" state={{ type: 'new' }} className='admin-grid-section'>
            <button className='btn btn-success'>
              Add A Product
            </button>
        </Link>
      </div>
    </>
  )
}

export default ViewProduct