import { Routes, Route } from "react-router-dom";
import {
  AuthProvider,
  TimerProvider,
  ProductProvider,
  StoreProvider,
  TimerPvPProvider,
  BrowserRouter,
  Navbar,
  HomePage,
  LoginPage,
  RegisterPage,
  AprendizajePage,
  MetodoP,
  Timer,
  ProductPage,
  Camara,
  Store,
  TimerUserLoged,
  ProfilePage,
  Account,
  TimerPvP,
  Confirmation,
  TorneoPage,
  ProtectedRoute,
  TorneoProvider,
  TorneoGetPage,
  YourTournament,
  WaitRoom,
} from "./imports";

function App() {
  return (
    <AuthProvider>
      <TimerProvider>
        <ProductProvider>
          <StoreProvider>
            <TimerPvPProvider>
              <TorneoProvider>
              <BrowserRouter>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/learn" element={<AprendizajePage />}></Route>
                  <Route path="/metodop" element={<MetodoP />}></Route>
                  <Route path="/timer" element={<Timer />}></Route>
                  <Route path="/product" element={<ProductPage />} />
                  <Route path="/camara" element={<Camara />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="/store" element={<Store />} />
                    <Route path="/timerul" element={<TimerUserLoged />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/account/password" element={<Account />} />
                    <Route path="/timerpvp" element={<TimerPvP />} />
                    <Route path="/confirmation" element={<Confirmation />} />
                    <Route path="/torneo" element={<TorneoPage />} />
                    <Route path="/torneoget" element={<TorneoGetPage />} />
                    <Route path="/yourtournament" element={<YourTournament />} />
                    <Route path="/waitroom" element={<WaitRoom />} />
                  </Route>
                </Routes>
              </BrowserRouter>
              </TorneoProvider>
            </TimerPvPProvider>
          </StoreProvider>
        </ProductProvider>
      </TimerProvider>
    </AuthProvider>
  );
}

export default App;
