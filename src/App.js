import React, { useEffect, Suspense, lazy } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, selectIsAuthenticated } from './store/userSlice';
import { fetchCart } from './store/cartSlice';
import { fetchFavorites } from './store/favoritesSlice';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./components/home'));
const Collections = lazy(() => import('./components/collections'));
const AboutUs = lazy(() => import('./components/aboutUs'));
const ContactUs = lazy(() => import('./components/contactUs'));
const Profile = lazy(() => import('./components/profile'));
const Cart = lazy(() => import('./components/cart'));
const ProductView = lazy(() => import('./components/ProductView'));
const Favorites = lazy(() => import('./components/Favorites'));
const BuyNow = lazy(() => import('./components/BuyNow'));
const SizeGuide = lazy(() => import('./components/SizeGuide'));
const ReturnPolicy = lazy(() => import('./components/ReturnPolicy'));
const ShippingInfo = lazy(() => import('./components/ShippingInfo'));
const FAQ = lazy(() => import('./components/FAQ'));
const OrderHistory = lazy(() => import('./components/OrderHistory'));
const OrderDetails = lazy(() => import('./components/OrderDetails'));
// const ColorAnalysis = lazy(() => import('./components/ColorAnalysis'));
const NotFound = lazy(() => import('./components/NotFound'));

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchFavorites());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Router>
      <Header />
      <main className="app-main">
        <Suspense fallback={<LoadingSpinner />}>
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
            <Route path="/buynow/multi" element={<BuyNow />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/shipping-info" element={<ShippingInfo />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            {/* <Route path="/color-analysis" element={<ColorAnalysis />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </Router>
  );
}

export default App;