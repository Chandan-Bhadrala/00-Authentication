import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useLazyLoadUserQuery } from "./features/auth/authApi";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  const [triggerLoadUser] = useLazyLoadUserQuery();

  useEffect(() => {
    triggerLoadUser(); // ✅ Calls loadUser API once on refresh
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
