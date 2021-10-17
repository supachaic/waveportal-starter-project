import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hakuna Matata!
        </div>

        <div className="bio">
        I am Simba and here my dear friends, Timon and Pumba. They tought me the word of wisdom, 'Hakuna Matata!'. Connect your Ethereum wallet and wave at me!
        </div>
        <br />

        <img src='/The-Lion-King2.jpeg' alt='Lion King' />

        <button className="waveButton" onClick={wave}>
          Wave at Me, Hakuna Matata!
        </button>
      </div>
    </div>
  );
}
