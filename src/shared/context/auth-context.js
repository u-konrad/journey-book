import { createContext } from 'react';

export const AuthContext = createContext({
  loginState:'pending',
  isLoggedIn: false,
  userId: null,
  token: null,
  username:null,
  login: () => {},
  logout: () => {}
});
