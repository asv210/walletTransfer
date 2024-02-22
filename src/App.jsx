import { AppContextProvider } from "./context/AppContext";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <AppContextProvider>
        <Home />
        <Toaster />
      </AppContextProvider>
    </>
  );
}

export default App;
