import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import RegisterPage from "./components/auth/RegisterPage";
import LoginPage from "./components/auth/LoginPage";
import HomePage from "./components/home_menu/HomePage";



function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <div className="content">
      <Routes>
              <Route path="/register" element={<RegisterPage  />} />
              <Route path="/login" element={<LoginPage  />} />
              <Route path="/home" element={<HomePage  />} />


      </Routes>

    </div>
    <Footer/>
    </BrowserRouter>
    
  );
}

export default App;
