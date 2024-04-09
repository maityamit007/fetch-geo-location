import React, { useEffect, useState } from 'react';
import './Form.css';
import CircularProgress from '@mui/material/CircularProgress';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';

function Form() {
  let [loader, setLoder] = useState(false);
  let [addressDetails, setAddressDetails] = useState({
    'latitude': '',
    'longitude': '',
    'country': '',
    'state': '',
    'city': '',
    'postalCode': '',
    'zone': '',
    'ipAddress': ''
  });

  const executeBeforeConfirmation = () => {
    setLoder(true);
    return Promise.resolve();
  }

  const confirmAction = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((pos) => {
        if (pos) {
          axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos?.coords?.latitude}&lon=${pos?.coords?.longitude}`).then((data) => {
            setAddressDetails((prevState) => {
              return {
                ...prevState,
                'latitude': pos?.coords?.latitude,
                'longitude': pos?.coords?.longitude,
                'country': data.data.address.country,
                'state': data.data.address.state,
                'city': data.data.address.city,
                'postalCode': data.data.address.postcode,
                'zone': 'Bali',
              }
            })
          });
          resolve(true);
        } else {
          resolve(false);
        }
        axios.get(`https://ipinfo.io/json?token=bac82808729b5d`)
          .then(data => {
            setAddressDetails((prevState) => {
              return { ...prevState, 'ipAddress': data.data.ip }
            })
          })      
        })
    });
  }

  useEffect(()=>{
    if(addressDetails['country'] !== '' && addressDetails['ipAddress'] !== ''){
      axios.post(`/api/location/save-location`, addressDetails, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }).then((resp)=>{
        console.log(resp);
        if(resp.data){
          alert(`${resp.data.message}`);
        }
      });
    }
  }, [addressDetails])

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
          {addressDetails['country'] !== '' &&
            <span className='font-bold text-black'>
              {`${addressDetails['zone']},${addressDetails['city']},${addressDetails['state']},${addressDetails['postalCode']}, ${addressDetails['country']}`}
            </span>
          }
        </div>
        <div className='mt-10'>
          {addressDetails['latitude'] !== '' &&
            <div style={{ height: '400px', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: '' }}
                defaultCenter={{ lat: addressDetails['latitude'], lng: addressDetails['longitude'] }}
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
