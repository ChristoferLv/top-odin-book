import { use, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router";
import { getMe, logOut } from "../api/requests";

function getJwtExpiration(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));
  return payload.exp
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const storagedUser = localStorage.getItem('user');
    const storagedToken = localStorage.getItem('token');
    if (storagedToken) {
      let timerId = null;
      const exp = getJwtExpiration(storagedToken);
      const expirationTime = exp * 1000;
      const timeUntilExpiry = expirationTime - Date.now();
      if (timeUntilExpiry > 0) {
        timerId = setTimeout(() => {
          logOut();
        }, timeUntilExpiry);
      } else {
        logOut();
        return;
      }

      if (user) {
        setIsLoading(false);
      }
      if (!user) {
        if (storagedUser) {
          setUser(JSON.parse(storagedUser));
          setIsLoading(false);
        } else if (storagedToken) {
          getMe()
            .then((meResult) => {
              const user = meResult.data;
              localStorage.setItem("user", JSON.stringify(user));
              setUser(user);
              setIsLoading(false);
            });
        } else {
          setUser(null)
          setIsLoading(false);
        }
      }
      return () => clearTimeout(timerId);

    } else {
      setUser(null)
      setIsLoading(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}