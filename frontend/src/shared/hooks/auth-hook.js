import { useCallback, useEffect, useState } from "react";

let logOutTimer = "";

export const useAuth = () => {

    const [token, setToken] = useState();
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState();
  
    const login = useCallback((uid, token, expiration) => {
      setToken(token);
      setUserId(uid);
  
      const tokenExpirationDate = new Date(expiration || new Date().getTime() + (1000 * 60 * 60));
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem('userData', JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      }))
    }, [])
  
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
        login(storedData.userId, storedData.token, storedData.expiration);
      }
    }, [login]);
    
    const logout = useCallback(() => {
      setToken(null);
      setUserId(null);
      setTokenExpirationDate(null);
      localStorage.removeItem('userData');
    }, [])
  
    useEffect(() => {
      if (token && tokenExpirationDate) {
        const remaningTime = tokenExpirationDate.getTime() - new Date().getTime();
        logOutTimer = setTimeout(logout, remaningTime);
      } else {
        clearTimeout(logOutTimer);
      }
    }, [token, logout, tokenExpirationDate]);

  return { userId, token, login, logout };
}