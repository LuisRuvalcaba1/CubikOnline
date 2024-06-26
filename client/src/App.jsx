import {
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
  TorneoPage,
  TorneoProvider,
  TorneoGetPage,
  YourTournament,
  WaitRoom,
  RankingUsers,
  MetodoFriedrich,
  CategoryPage,
  Amigos,
  AmigosProvider,
  EncuestaProvider,
  ObjetiveProvider,
  Objetivos,
  Metodo2x2,
  Metodo4x4,
  Metodo5x5,
} from "./imports.js";

function App() {
  return (
    <AuthProvider>
      <TimerProvider>
        <ProductProvider>
          <StoreProvider>
            <TimerPvPProvider>
              <TorneoProvider>
                <AmigosProvider>
                  <EncuestaProvider>
                    <ObjetiveProvider>
                    <BrowserRouter>
                      <Navbar />
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route
                          path="/learn"
                          element={<AprendizajePage />}
                        ></Route>
                        <Route path="/category" element={<CategoryPage />} />
                        <Route path="/metodop" element={<MetodoP />}></Route>
                        <Route
                          path="/metodof"
                          element={<MetodoFriedrich />}
                        ></Route>
                        <Route path="/timer" element={<Timer />}></Route>
                        <Route path="/product" element={<ProductPage />} />
                        <Route path="/metodo2x2" element={<Metodo2x2 />} />
                        <Route path="/metodo4x4" element={<Metodo4x4 />} />
                        <Route path="/metodo5x5" element={<Metodo5x5 />} />
                        <Route path="/metodop" element={<MetodoP />} />

                        <Route element={<ProtectedRoute />}>
                          <Route path="/store" element={<Store />} />
                          <Route path="/timerul" element={<TimerUserLoged />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/objetives" element={<Objetivos />} />
                          <Route
                            path="/account/password"
                            element={<Account />}
                          />
                          <Route path="/timerpvp" element={<TimerPvP />} />
                          <Route path="/friends" element={<Amigos />} />
                          <Route
                            path="/rankingusers"
                            element={<RankingUsers />}
                          />
                          <Route path="/torneo" element={<TorneoPage />} />
                          <Route
                            path="/torneoget"
                            element={<TorneoGetPage />}
                          />
                          <Route
                            path="/yourtournament"
                            element={<YourTournament />}
                          />
                          <Route path="/waitroom" element={<WaitRoom />} />
                          
                        </Route>
                      </Routes>
                    </BrowserRouter>
                    </ObjetiveProvider>
                  </EncuestaProvider>
                </AmigosProvider>
              </TorneoProvider>
            </TimerPvPProvider>
          </StoreProvider>
        </ProductProvider>
      </TimerProvider>
    </AuthProvider>
  );
}

export default App;
