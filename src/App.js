import React, { useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUser } from './store/userSlice';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/home';
import Collections from './components/collections';
import AboutUs from './components/aboutUs';
import ContactUs from './components/contactUs';
import Profile from './components/profile';
import Cart from './components/cart';
import ProductView from './components/ProductView';
import Favorites from './components/Favorites';
import BuyNow from './components/BuyNow';
import SizeGuide from './components/SizeGuide';
import ReturnPolicy from './components/ReturnPolicy';
import ShippingInfo from './components/ShippingInfo';
import FAQ from './components/FAQ';
import OrderHistory from './components/OrderHistory';
import OrderDetails from './components/OrderDetails';
import ColorAnalysis from './components/ColorAnalysis';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductView />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/buynow/:productId?" element={<BuyNow />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/shipping-info" element={<ShippingInfo />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/color-analysis" element={<ColorAnalysis />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;