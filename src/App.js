import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import Explore from './Pages/Explore'
import Category from './Pages/Category'
import ContactUser from './Pages/ContactUser'
import ForgotPassword from './Pages/ForgotPassword'
import ItemListing from './Pages/ItemListing'
import NewListing from './Pages/NewListing'
import UpdateListing from './Pages/UpdateListing'
import Offers from './Pages/Offers'
import Profile from './Pages/Profile'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import Footer from "./Components/Footer"
import Navbar from './Components/Navbar'

import PrivateRoute from './Components/PrivateRoute'





export default function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
      
        <Route path='/' element={<PrivateRoute />}>  
          <Route path='/' element={<Explore />} />
        </Route>

        <Route path='/profile' element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>

        <Route path='/offers' element={<PrivateRoute />}>  
          <Route path='/offers' element={<Offers />} />
        </Route>

        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        

        <Route path='/category/:categoryName' element={<Category />} />
        <Route path='/add-listing' element={<NewListing />} />
        <Route path='/update-listing/:id' element={<UpdateListing />} />
        <Route path='/forgot' element={<ForgotPassword />} />
        
        <Route path ='/category/:categoryName/:listingId' element={<ItemListing />} />
        <Route path='/contact/:landlordId' element={<ContactUser />} />
        
      </Routes>
      <Footer />
    </Router>

    <ToastContainer />
    </>
  )
}
