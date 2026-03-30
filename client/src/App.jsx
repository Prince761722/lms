import './App.css'

import { Toaster } from "react-hot-toast";
import { Route, Routes } from 'react-router-dom'

import AboutUs from './pages/about'
import ContactUs from './pages/ContactUs'
import CourseList from './pages/Courses/CourseList'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Signup from './pages/Signup'
import CourseDescription from './pages/Courses/CourseDescription';
import RequireAuth from './components/auth/RequreAuth';
import AdminDashboard from './pages/AdminDashboard'
import Denied from './pages/Denied';
import CreateCourse from './pages/Courses/CreateCourse';
import Profile from './pages/User/Profile';
import EditProfile from './pages/User/EditProfile';
import Checkout from './pages/Payment/Checkout';
import PaymentSucess from './pages/Payment/paymentSucess';
import PaymentFailed from './pages/Payment/PaymentFailed';
import AddLecture from './pages/Leactures/AddLeacture';
import DisplayLeacture from './pages/Leactures/DisplayLeacture';
import WatchLecture from './pages/Leactures/WatchLexture';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDescription />} />
        <Route path="/denied" element={<Denied />} />
        <Route path="*" element={<NotFound />} />

        {/* USER + ADMIN */}
        <Route element={<RequireAuth allowedRoles={["user", "admin"]} />}>

          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/profile/edit" element={<EditProfile />} />

          <Route path="/payment/checkout" element={<Checkout />} />
          <Route path="/payment/success" element={<PaymentSucess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
          <Route path="/lecture/:courseId" element={<DisplayLeacture />} />
          <Route path="/lecture/watch/:courseId/:lectureId" element={<WatchLecture />} />

        </Route>

        {/* ADMIN ONLY */}
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/course/create" element={<CreateCourse />} />
          <Route path="/lecture/add/:courseId" element={<AddLecture />} />

        </Route>

      </Routes>
    </>
  )
}

export default App;