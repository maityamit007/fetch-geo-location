import React, { useEffect, useState } from 'react';
import './Form.css';
import CircularProgress from '@mui/material/CircularProgress';
import GoogleMapReact from 'google-map-react';

function Form() {
  let [loader, setLoder] = useState(false);
  let [addressDetails, setAddressDetails] = useState({
    'Latitude': '',
    'Longitude': '',
    'Country': '',
    'State': '',
    'City': '',
    'Postal Code': '',
    'Zone': '',
    'IP Address': ''
  });

  const executeBeforeConfirmation = () => {
    setLoder(true);
    return Promise.resolve();
  }

  const confirmAction = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((pos) => {
        console.log(pos);
        if (pos) {
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos?.coords?.latitude}&lon=${pos?.coords?.longitude}`).then((resp) => {
            return resp.json();
          }).then((data) => {
            setAddressDetails((prevState) => {
              return {
                ...prevState,
                'Latitude': pos?.coords?.latitude,
                'Longitude': pos?.coords?.longitude,
                'Country': data.address.country,
                'State': data.address.state,
                'City': data.address.city,
                'Postal Code': data.address.postcode,
                'Zone': data.address.suburb,
              }
            })
          });
          resolve(true);
        } else {
          resolve(false);
        }
        fetch(`https://ipinfo.io/json?token=bac82808729b5d`)
          .then(response => { return response.json() })
          .then(data => {
            setAddressDetails((prevState) => {
              return { ...prevState, 'IP Address': data.ip }
            })
          })      
        })
    });
  }

  const fetchLocation = () => {
    setLoder(true);
    setTimeout(() => {
      executeBeforeConfirmation().then(() => {
        return confirmAction();
      }).then((result) => {
        if (result) {
          setLoder(false);
        }
      })
    }, 10);
  }

  return (
    <div className='container justify-center'>
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 md:gap-4">
        <div className="p-4"><h2 className="text-2xl font-semibold">Geolocation POC</h2></div>
        <div className="p-4 flex items-center justify-center">
          <button onClick={fetchLocation} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-10 rounded">Fetch location </button>
        </div>
      </div>
      <div className='mt-10'>
        {Object.keys(addressDetails).map((ele, index) => (
          <div className='' key={index}>
            <div className="flex-grow border-t border-gray-300"></div>
            <div className="flex flex-row justify-between">
              <div className="p-4"><h2 className="font-semibold">{ele}</h2></div>
              {loader ?
                <div className="p-4"><CircularProgress /></div> :
                <div className="p-4 font-semibold">{addressDetails[ele]}</div>
              }
            </div>
          </div>
        ))}
      </div>
      <div className='mt-10'>
        <div className='bg-gray-200 h-40 w-full rounded flex justify-center items-center'>
          {addressDetails['Country'] !== '' &&
            <span className='font-bold text-black'>
              {`${addressDetails['City']},${addressDetails['State']},${addressDetails['Postal Code']}, ${addressDetails['Country']}`}
            </span>
          }
        </div>
        <div className='mt-10'>
          {addressDetails['Latitude'] !== '' &&
            <div style={{ height: '400px', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: '' }}
                defaultCenter={{ lat: addressDetails['Latitude'], lng: addressDetails['Longitude'] }}
                defaultZoom={10}
              ></GoogleMapReact>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Form
