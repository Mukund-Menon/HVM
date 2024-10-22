import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    if (accessToken === null) {
      navigate("/", { replace: true });  // Replaces the history entry, preventing "back" navigation
    }
  }, [accessToken, navigate]);

  return null; // Since Auth doesn't render anything, it returns null
};

export default Auth;
