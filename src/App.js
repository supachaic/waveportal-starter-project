import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

export default function App() {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  const contractAddress = '0xd942155A57E6FeF0DFbE8F2ADb3C034f8C861fC2';
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

    /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();
        
        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);

        /**
         * Listen in for emitter events!
         */
        wavePortalContract.on("NewWave", (from, timestamp, message) => {
          console.log("NewWave", from, timestamp, message);

          setAllWaves(prevState => [...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
          }]);
        });
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
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
          updateStatus(`Retrieved total wisdom count... ${count.toNumber()}`);
  
          /*
          * Execute the actual wave from your smart contract
          */
          const waveTxn = await wavePortalContract.wave(message, {gasLimit: 500000});
          updateStatus(`Mining... ${waveTxn.hash}`);
          setMessage("");
  
          await waveTxn.wait();
          updateStatus(`Mined --  ${waveTxn.hash}`);
  
          count = await wavePortalContract.getTotalWaves();
          updateStatus(`Retrieved total wisdom count... ${count.toNumber()}`);

          // getAllWaves();
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
          setCurrentAccount(account);
          getAllWaves();
        } else {
          updateStatus("No authorized account found");
        }
      } catch (error) {
        console.log(error);
      }
    }

    checkIfWalletIsConnected();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        <span role="img" aria-label='wave'>👋</span> Hakuna Matata!
        </div>

        <div className="bio">
        I am Simba and here my dear friends, Timon and Pumba. They tought me the words of wisdom, 'Hakuna Matata!'. Now, I want to learn more. Connect your Ethereum wallet and teach me your words of wisdom!
        </div>
        <br />

        <img src='/The-Lion-King2.jpeg' alt='Lion King' />
        <br />
        <textarea 
          rows="3" 
          type="text" 
          onChange={e => {
            e.preventDefault();
            setMessage(e.target.value);
            }} 
          value={message} 
          placeholder={`Teach Me Some Words of Wisdom.`}/>
        <button className="waveButton" onClick={wave}>
          Click to Send. Hakuna Matata!
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

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}
