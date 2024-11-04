import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Converter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [converted, setConverted] = useState(false);

  useEffect(() => {
    // Fetch list of currency symbols
    axios.get('https://api.exchangerate-api.com/v4/latest/USD')
      .then(response => {
        setCurrencies(Object.keys(response.data.rates));
      })
      .catch(error => console.error('Error fetching currency data:', error));
  }, []);

  const convertCurrency = () => {
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return; // Menghentikan eksekusi jika amount tidak valid
    }
    
    axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      .then(response => {
        const rate = response.data.rates[toCurrency];
        if (rate) {
          setResult(rate * amount);
          setConverted(true); // Set flag converted menjadi true
        } else {
          console.error('Currency not found');
        }
      })
      .catch(error => console.error('Error converting currency:', error));
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card w-50">
        <div className="card-body">
          <h2 className="text-center">Currency Converter</h2>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setConverted(false); // Reset flag ketika nilai diubah
              }}
            />
          </div>
          <div className="form-group">
            <label>From</label>
            <select
              className="form-control"
              value={fromCurrency}
              onChange={(e) => {
                setFromCurrency(e.target.value);
                setConverted(false); // Reset flag ketika mata uang diubah
              }}
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>To</label>
            <select
              className="form-control"
              value={toCurrency}
              onChange={(e) => {
                setToCurrency(e.target.value);
                setConverted(false); // Reset flag ketika mata uang diubah
              }}
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary mt-3" onClick={convertCurrency}>
            Convert
          </button>
          {converted && result !== null && (
            <div className="alert alert-success mt-3">
              {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Converter;
