import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import PageNotFound from "./pages/PageNotFound";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
