import React from 'react';
import Home from './page/Home';
import Admin from './page/Admin';
import Order from './page/Order';
import About from './page/About';
import Contact from './page/Contact';
import Footer from './comp/Footer';
import { BrowserRouter, Routes ,Route} from 'react-router-dom';
import Auth from './Authentication/Auth';
import { AuthProvider } from './Authentication/Authpro';
import Protectroute from './Authentication/Protectroute';

function App() {
  return (
    <section>
      <AuthProvider>
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home />}/>
              <Route path='/about' element={<About />}/>
              <Route path='/contact' element={<Contact />}/>
              <Route path='/admin'  element={<Protectroute> <Admin /> </Protectroute> }/>
              <Route path='/order' element={<Order />}/>
              <Route path='/auth' element={<Auth />}/>
            </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Footer/>

    </section>
  );
}

export default App;
