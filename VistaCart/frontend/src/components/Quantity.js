import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Quantity() {
  const [catList, setCatList] = useState([]);
  const [formErrors, setFormErrors] = useState(null);
  const [sku, setSku] = useState('');

  const SearchProduct = (e) => {
    e.preventDefault();
    const formErrors = {
      sku: !sku,
    };

    setFormErrors({ ...formErrors });
    if (Object.values(formErrors).some((v) => v)) return;

    const formData = new FormData();
    formData.append('sku', sku);

    axios.post('http://localhost:8080/api/quantity/getQuantityBySku', formData, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.quantity);
          setCatList(response.data.quantity); // Update catList with search results
        } else {
          alert('NO DATA FOUND!');
        }
      })
      .catch((err) => {
        alert('NO DATA FOUND!');
      });
  };

  return (
    <>
      <h1 className="text-center m-5">Quantity</h1>
      
      <div className='container mt-5 mb-5 d-flex justify-content-center'>

        <Link to="/AddUpdateQuantity" state={{ type: 'new' }} >
            <button className='btn btn-primary p-2 m-2'>
              Add Quantity for product
            </button>
        </Link>
        
        <Link to="/UpdateQuantity" >
            <button className='btn btn-secondary p-2 m-2'>
              Update Quantity for product
            </button>
        </Link>
      </div>
      
      <hr />

      <div className="container mt-5 mb-5">
        <h3 className="text-center">Search for a product</h3>
        <form onSubmit={SearchProduct} method="post">
          <div className="form-group col-sm-6 margin-center">
            <label htmlFor="productId">Product SKU: </label>
            <br />
            <input
              type="text"
              className={`form-control ${formErrors && (formErrors?.sku ? 'is-invalid' : 'is-valid')}`}
              id="sku"
              name="sku"
              value={sku}
              onChange={(e) => {
                setSku(e.currentTarget.value);
              }}
              placeholder="Enter SKU"
            />
            <div className="invalid-feedback">Please enter a valid SKU.</div>
          </div>

          <div className="col-sm-6 margin-center">
            <button type="submit" className="btn btn-warning mt-2 mb-4">
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="container">
        <table className="table table-striped table-dark mt-5">
          <thead>
            <tr>
              <th scope="col">SKU</th>
              <th scope="col">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {catList && catList.length > 0 ? (
              catList.map((cat) => (
                <tr key={cat._id}>
                  <td>{cat.sku}</td>
                  <td>{cat.quantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center">
                  <b>No record found</b>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Quantity;
