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
import TimerUserLoged from "./pages/TimerUserLoged.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { TimerProvider } from "./context/TimerContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import Account from "./pages/Account.jsx";
import { StoreProvider } from "./context/StoreContext.jsx";
import Store from "./pages/Store.jsx";
import ProductPage from "./pages/ProductPage.jsx";

function App() {
  return (
    <AuthProvider>
      <TimerProvider>
        <ProductProvider>
          <StoreProvider>
            <BrowserRouter>
              <Navbar/>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/learn" element={<AprendizajePage />}></Route>
                <Route path="/metodop" element={<MetodoP />}></Route>
                <Route path="/timer" element={<Timer />}></Route>
                <Route path="/product" element={<ProductPage />} />

                <Route element={<ProtectedRoute />}>
                <Route path="/store" element={<Store />} />
                  <Route path="/timerul" element={<TimerUserLoged />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/account/password" element={<Account />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </StoreProvider>
        </ProductProvider>
      </TimerProvider>
    </AuthProvider>
  );
}

export default App;
