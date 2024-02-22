import { MetaMaskProvider } from "@metamask/sdk-react";

export const MetamaskProvider = ({ children }) => {
  return (
    <>
      <MetaMaskProvider debug={true} sdkOptions={{dappMetadata:{
        name: "Fund me DApp",
        url:window.location.host
      }}}>
        {children}
      </MetaMaskProvider>
    </>
  );
};
