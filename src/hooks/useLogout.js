import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');

      // Make the POST call to the logout endpoint
      const response = await axios.post(
        'https://api.clipzy.ai/logout',
        {},  // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Check if the logout was successful
      if (response.data === 'Successfully Logged Out!') {
        // Remove the token from localStorage
        localStorage.removeItem('token');
        
        // Remove any other user-related data from localStorage if needed
        localStorage.removeItem('userId');

        // Navigate to the SignIn page
        navigate('/signin');
      } else {
        // Handle unexpected response
        console.error('Unexpected logout response:', response.data);
      }
    } catch (error) {
      // Handle any errors that occur during the logout process
      console.error('Error during logout:', error);
      
      // Optionally, you can still clear local storage and redirect even if the API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate('/signin');
    }
  };

  return logout;
};
