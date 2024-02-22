import { useSDK } from "@metamask/sdk-react";
import { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";
import { abi, contractAddress } from "../utils/Constant";

const initialState = {
  account: "",
  sdk: {},
  connecting: false,
  connected: false,
  connectToMetaMask: () => {},
  web3: {},
  provider: {},
};

const AppContext = createContext(initialState);
export const AppContextProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const { sdk, connected, connecting, provider } = useSDK();
  const connectToMetaMask = async () => {
    try {
      const accounts =await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (error) {
      console.log(`failed to connect...${error}`);
    }
  };

  const app = new Web3(window.ethereum);
  const web3 = new app.eth.Contract(abi, contractAddress);

  useEffect(() => {
    if (!account) {
      connectToMetaMask();
    }
  }, [connected]);
  return (
    <AppContext.Provider
      value={{
        account,
        connected,
        connecting,
        web3,
        connectToMetaMask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
export default AppContext;
