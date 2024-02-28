import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { AuthProvider } from "./context/AuthContext";
import ProfilePage from "./pages/ProfilePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AprendizajePage from "./pages/AprendizajePage.jsx";
import MetodoP from "./pages/MethotP.jsx";
import Timer from "./pages/Timer.jsx";
import TimerUserLoged  from "./pages/TimerUserLoged.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { TimerProvider } from "./context/TimerContext.jsx";

function App(){
  return(
    <AuthProvider>
      <TimerProvider>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/learn" element={<AprendizajePage/>}></Route>
          <Route path="/metodop" element={<MetodoP/>}></Route>
          <Route path="/timer" element={<Timer/>}></Route>
           
          <Route element={<ProtectedRoute/>}>
            <Route path="/timerul" element={<TimerUserLoged/>}/>
            <Route path="/profile" element={<ProfilePage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
      </TimerProvider>
    </AuthProvider>
  )
}

export default App;