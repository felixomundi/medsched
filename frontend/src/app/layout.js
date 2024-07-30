// import { Inter } from 'next/font/google'
import './globals.css'
import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapClient from './components/BootstrapClient.js';
import StoreProvider from '@/redux/provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>      
          <StoreProvider>               
          {children}          
          <ToastContainer />
          <BootstrapClient />
        </StoreProvider>
      </body>
      
    </html>
  )
}
