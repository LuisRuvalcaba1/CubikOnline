import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { AuthProvider } from "./context/AuthContext";
import ProfilePage from "./pages/ProfilePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AprendizajePage from "./pages/AprendizajePage.jsx";
import MetodoP from "./pages/MethotP.jsx";
import Timer from "./pages/TimerPages/Timer.jsx";
import TimerUserLoged from "./pages/TimerPages/TimerUserLoged.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { TimerProvider } from "./context/TimerContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import Account from "./pages/Account.jsx";
import { StoreProvider } from "./context/StoreContext.jsx";
import Store from "./pages/Store.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import TimerPvP from "./pages/TimerPages/TimerPvP.jsx";
import { TimerPvPProvider } from "./context/TimerPvPContext.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import TorneoPage from "./pages/TorneoPages/TorneoPage.jsx";
import { TorneoProvider } from "./context/TorneoContext.jsx";
import TorneoGetPage from "./pages/TorneoPages/TorneoGetPage.jsx";
import YourTournament from "./pages/TorneoPages/YourTournament.jsx";
import WaitRoom from "./pages/TorneoPages/WaitRoom.jsx";
import ResultRoundUsers from "./pages/TorneoPages/ResultRoundUsers.jsx";
import RankingUsers from "./pages/TimerPages/RankingUsers.jsx";

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
  RankingUsers,
};
