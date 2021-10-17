import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

export default function App() {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [status, setStatus] = useState("");

  const contractAddress = '0x772B25e744c7f0173302A137F60998F3c34ed7C9';
  const contractABI = abi.abi;

  const updateStatus = (msg) => {
    setStatus(msg);
    console.log(msg);
  }
  
  

   /**
  * Implement your connectWallet method here
  */
    const connectWallet = async () => {
      try {
        const { ethereum } = window;
  
        if (!ethereum) {
          alert("Get MetaMask!");
          return;
        }
  
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]); 
      } catch (error) {
        console.log(error)
      }
    }

    
  
    const wave = async () => {
      try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  
          let count = await wavePortalContract.getTotalWaves();
          updateStatus(`Retrieved total wave count... ${count.toNumber()}`);
  
          /*
          * Execute the actual wave from your smart contract
          */
          const waveTxn = await wavePortalContract.wave();
          updateStatus(`Mining... ${waveTxn.hash}`);
  
          await waveTxn.wait();
          updateStatus(`Mined --  ${waveTxn.hash}`);
  
          count = await wavePortalContract.getTotalWaves();
          updateStatus(`Retrieved total wave count... ${count.toNumber()}`);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error)
      }
    }
    
  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        const { ethereum } = window;
        
        if (!ethereum) {
          updateStatus("Make sure you have metamask!");
          return;
        } else {
          updateStatus("We have the ethereum object");
          console.log(ethereum);
        }
        
        /*
        * Check if we're authorized to access the user's wallet
        */
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length !== 0) {
          const account = accounts[0];
          updateStatus(`Found an authorized account: ${account}`);
          setCurrentAccount(account)
        } else {
          updateStatus("No authorized account found");
        }
      } catch (error) {
        console.log(error);
      }
    }

    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        <span role="img" aria-label='wave'>👋</span> Hakuna Matata!
        </div>

        <div className="bio">
        I am Simba and here my dear friends, Timon and Pumba. They tought me the word of wisdom, 'Hakuna Matata!'. Connect your Ethereum wallet and wave at me!
        </div>
        <br />

        <img src='/The-Lion-King2.jpeg' alt='Lion King' />

        <button className="waveButton" onClick={wave}>
          Wave at Me, Hakuna Matata!
        </button>

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount? (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        ):
        <div className="connectedButton">
          <p>Wallet Connected</p>
        </div> 
        }
        <div className="status">
          <p>{status}</p>
        </div>
      </div>
    </div>
  );
}
