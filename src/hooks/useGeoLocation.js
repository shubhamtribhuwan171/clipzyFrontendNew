import { useState, useEffect } from 'react';

const useGeoLocation = () => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        setCountry(data.country_code);
      })
      .catch(error => {
        console.error('Error fetching location:', error);
        setCountry('US'); // Default to US if there's an error
      });
  }, []);

  return country;
};

export default useGeoLocation;