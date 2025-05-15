import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import  axiosInstance from '../utils/axios';
import { router } from 'expo-router';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState({ token: String, user: null });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const res = await axiosInstance.post('/auth/login', { email, password });
  
    const { token, user } = res.data;
  
    // Store token as string directly
    await SecureStore.setItemAsync('token', token);
  
    // Store user object as JSON string
    await SecureStore.setItemAsync('user', JSON.stringify(user));
  
    // Set context/state
    setAuth({ token, user });
  
    // Navigate to home screen
    router.replace('/(tabs)');
  };
  

  const signup = async (name: string, email: string, password: string) => {
    const res = await axiosInstance.post('/auth/signup', { name, email, password });
    const { token, user } = res.data;

    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('user', JSON.stringify(user));

    setAuth({ token, user });
    router.replace('/(tabs)');
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    setAuth({ token: null, user: null });
    router.replace('/auth/login');
  };

  const loadUser = async () => {
    const token = await SecureStore.getItemAsync('token');
    const user = await SecureStore.getItemAsync('user');

    console.log(token, user);
    if (token && user) {
      setAuth({ token, user: JSON.parse(user) });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);


  return (
    <AuthContext.Provider value={{ auth, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
