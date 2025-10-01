import React from 'react';
import Home from './page/Home';
import Admin from './page/Admin';
import Order from './page/Order';
import Navbar from './comp/Navbar';
import Footer from './comp/Footer';
import { BrowserRouter, Routes ,Route} from 'react-router-dom';
import Auth from './Authentication/Auth';
import { AuthProvider } from './Authentication/Authpro';
import Protectroute from './Authentication/Protectroute';

function App() {
  return (
    <section>
      <Navbar/>
      <AuthProvider>
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home />}/>
              <Route path='/admin'  element={<Protectroute> <Admin /> </Protectroute> }/>
              <Route path='/order' element={<Order />}/>
              <Route path='/auth' element={<Auth />}/>
            </Routes>
        </BrowserRouter>
      </AuthProvider>
    </section>
  );
}

export default App;
