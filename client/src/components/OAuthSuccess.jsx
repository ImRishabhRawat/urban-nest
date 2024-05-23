// OAuthSuccess.jsx

import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(authContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const user = JSON.parse(urlParams.get('user'));

    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user,
          token,
          role: user.role,
        },
      });
      toast.success('Successfully logged in');
      navigate('/');
    } else {
      // toast.error('Failed to log in');
      navigate('/');
    }
  }, [dispatch, navigate]);

  return null;
};

export default OAuthSuccess;
