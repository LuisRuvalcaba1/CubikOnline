import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  //   proxy: {
  //     '/api': {
  //         target: 'https://cubikonline.onrender.com',
  //         changeOrigin: true,
  //         secure: false,
  //     },
  // },
    cors: true,
},
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Dividir los estilos en un chunk separado
          styles: ["./src/index.css"],

          api: [
            "./src/api/auth.js",
            "./src/api/encuesta.js",
            "./src/api/objetives.js",
            "./src/api/amigos.js",
            "./src/api/rank.js",
            "./src/api/userpvp.js",
            "./src/api/product.js",
            "./src/api/torneo.js",
            "./src/api/axios.js",
            "./src/api/store.js",
            "./src/api/timer.js",
            "./src/api/timerpvp.js",
          ],

          // Dividir los módulos de React en un chunk separado
          react: ["react", "react-dom"],

          // Dividir otros módulos comunes en chunks separados
          vendor: ["lodash", "axios", "socket.io-client", "react-router-dom"],

          // Dividir los componentes en chunks separados
          components: [
            "./src/components/Navbar.jsx",
            "./src/components/Navbar.css",
            "./src/components/Confirmation.jsx",

          ],

          images: [
            "./src/images/Capas.png",
            "./src/images/cruz_resuelta.png",
            "./src/images/dot1.png",
            "./src/images/dot2.png",
            "./src/images/L_case.png",
            "./src/images/linea.png",
            "./src/images/mov1_arista.png",
            "./src/images/mov2_arista.png",
            "./src/images/mov1.png",
            "./src/images/mov2.png",
            "./src/images/mov3.png",
            "./src/images/Notacion.png",
            "./src/images/Partes_rubik.png",
            "./src/images/Posicion_de_la_cruz.png",
          ],

          // Dividir las páginas en chunks separados
          pages: [
            "./src/pages/Account.jsx",
            "./src/pages/Aprendizaje.css",
            "./src/pages/AprendizajePage.jsx",
            "./src/pages/MethotP.jsx",
            "./src/pages/Metodo2x2Page.jsx",
            "./src/pages/Metodo3x3Page.jsx",
            "./src/pages/Metodo4x4Page.jsx",
            "./src/pages/Metodo5x5Page.jsx",
            "/src/pages/Objetivos.jsx",
            "./src/pages/ProductPage.jsx",
            "./src/pages/ProfilePage.jsx",
            "./src/pages/RegisterPage.jsx",
          ],

          pages2:[
            "./src/pages/Store.jsx",
            "./src/pages/Torneo.css",
            "./src/pages/TimerPvP.jsx",
            "./src/pages/Timer.jsx",
            "./src/pages/Timer.css",
            "./src/pages/TimerUserLoged.jsx",
            "./src/pages/TorneoGetPage.jsx",
            "./src/pages/TorneoPage.jsx",
            "./src/pages/WaitRoom.jsx",
            "./src/pages/YourTournament.jsx",
            "./src/pages/HomePage.jsx",
            "./src/pages/LoginPage.jsx",
          ],

          // Dividir los contextos en un chunk separado
          contexts: [
            "./src/context/ProductContext.jsx",
            "./src/context/StoreContext.jsx",
            "./src/context/TimerContext.jsx",
            "./src/context/TimerPvPContext.jsx",
            "./src/context/TorneoContext.jsx",
            "./src/context/AmigosContext.jsx",
            "./src/context/EncuestaContext.jsx",
            "./src/context/ObjetivesContext.jsx",
            "./src/context/AuthContext.jsx",

          ],

          // Resto del código en el chunk principal
          app: ["./src/App.jsx"],
        },
      },
    },
  },
});
