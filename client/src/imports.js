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
import TimerPvP from "./pages/TimerPvP.jsx";
import { TimerPvPProvider } from "./context/TimerPvPContext.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import TorneoPage from "./pages/TorneoPage.jsx";
import { TorneoProvider } from "./context/TorneoContext.jsx";
import TorneoGetPage from "./pages/TorneoGetPage.jsx";
import YourTournament from "./pages/YourTournament.jsx";
import WaitRoom from "./pages/WaitRoom.jsx";
import ResultRoundUsers from "./pages/ResultRoundUsers.jsx";

export {
  BrowserRouter,
  Routes,
  Route,
  RegisterPage,
  LoginPage,
  AuthProvider,
  ProfilePage,
  HomePage,
  ProtectedRoute,
  AprendizajePage,
  MetodoP,
  Timer,
  TimerUserLoged,
  Navbar,
  TimerProvider,
  ProductProvider,
  Account,
  StoreProvider,
  Store,
  ProductPage,
  TimerPvP,
  TimerPvPProvider,
  Confirmation,
  TorneoPage,
  TorneoProvider,
  TorneoGetPage,
  YourTournament,
  WaitRoom,
  ResultRoundUsers,
};
