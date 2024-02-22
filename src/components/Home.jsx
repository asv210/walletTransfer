import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import Web3 from "web3";
const Home = () => {
  const { connected, connecting, web3, connectToMetaMask, account } =
    useAppContext();
  const [transfer, setTransfer] = useState({
    address: "",
    amount: 0,
    remark: "",
    addressSearch: "",
  });
  const [balance, setBalance] = useState();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState("ideal");
  const getTransactions = async () => {
    try {
      setIsLoading("fetching");
      const transactions = await web3.methods.getAllTransactions().call();
      console.log(transactions);
      setTransactions(transactions);
      setIsLoading("ideal");
    } catch (err) {
      setIsLoading("ideal");
      console.log(err);
      toast(`Error Occurred ${err}`);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      transfer.address === "" ||
      transfer.amount === 0 ||
      transfer.remark === ""
    ) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setIsLoading("transferring");
      if (!account) {
        toast.error("please connect your wallet first");
        setIsLoading("idle");
        return;
      }
      console.log(Web3.utils.toWei(String(transfer.amount), "ether"));
      const transferPromise = await web3.methods
        .sendMoney(
          transfer.address,
          Web3.utils.toWei(String(transfer.amount), "wei"),
          transfer.remark
        )
        .send({
          from: account,
          value: Web3.utils.toWei(String(transfer.amount), "wei"),
          gas: 3000000,
        })
        .on("receipt", () => {
          setTransfer({ ...transfer, address: "", amount: 0, remark: "" });
          getTransactions();
          toast.success(" Transfer successfully");
          setIsLoading("idle");
        })
        .on("error", () => {
          throw new Error("error in adding number in try");
        });
    } catch (error) {
      setIsLoading("idle");
      console.log(error);
      toast.error(`Error: ${error}`);
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    if (transfer.addressSearch === "") {
      toast.error("Please fill field");
      return;
    }
    try {
      setIsLoading("searching");
      if (!account) {
        toast.error("please connect your wallet first");
        setIsLoading("idle");
        return;
      }

      const transferPromise = await web3.methods
        .getBalance(transfer.addressSearch)
        .call();
      setIsLoading("idle");
      setTransfer({ ...transfer, addressSearch: "" });
      console.log(transferPromise);
      setBalance(transferPromise);
    } catch (error) {
      setIsLoading("idle");
      console.log(error);
      toast.error(`Error: ${error}`);
    }
  };

  useEffect(() => {
    console.log(connected);
    getTransactions();
  }, [connected]);
  return (
    <div>
      <div>
        {!connected && (
          <button onClick={connectToMetaMask}>
            {connecting ? "connecting..." : "connect to metamask"}
          </button>
        )}
      </div>

      <div>
        <h2>Transaction Form</h2>
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="enter address of receiver"
            onChange={(e) =>
              setTransfer({ ...transfer, address: e.target.value })
            }
            value={transfer.address}
            disabled={!connected}
          />
          <input
            type="number"
            placeholder="enter amount "
            onChange={(e) =>
              setTransfer({ ...transfer, amount: e.target.value })
            }
            value={transfer.amount}
            disabled={!connected}
          />
          <input
            type="text"
            placeholder="enter remarks"
            onChange={(e) =>
              setTransfer({ ...transfer, remark: e.target.value })
            }
            value={transfer.remark}
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!connected || isLoading === "transferring"}
          >
            {isLoading === "transferring" ? "Transferring" : "Transfer"}
          </button>
        </form>
      </div>
      <hr />
      <h2>All the transactions :</h2>
      <div style={{ height: "50vh", overflow: "scroll" }}>
        {transactions.map((item, index) => {
          return (
            <div key={index}>
              <p> transaction no. {index + 1}</p>
              <p>Sender is {item[0]}</p>
              <p>Receiver is {item[1]}</p>
              <p>
                Amount of ether is{" "}
                {Web3.utils.toWei(String(item[2]), "wei") / 10 ** 18}Ether
              </p>
              <p>Remarks is {item[3]}</p>
              <p>Time is {new Date(parseInt(item[4]) * 1000).toUTCString()}</p>
              <hr />
            </div>
          );
        })}
      </div>
      <div>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="enter address"
            onChange={(e) =>
              setTransfer({ ...transfer, addressSearch: e.target.value })
            }
            value={transfer.addressSearch}
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!connected || isLoading === "searching"}
          >
            {isLoading === "searching" ? "searching" : "search"}
          </button>
        </form>
        {balance ? (
          <div>Your balance is {parseInt(balance) / 10 ** 18} ETH</div>
        ) : (
          <p>enter addres</p>
        )}
      </div>
    </div>
  );
};

export default Home;
