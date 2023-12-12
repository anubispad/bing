"use client"
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SpaceIcon, Sparkle, Sparkles } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ethers } from "ethers";

import { futuresDexJson } from "../../../../constants";


import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalSigner } from '@web3modal/ethers5/react'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'

let tvScriptLoadingPromise

const FeatureDex = () => {
  const { open } = useWeb3Modal()

  const [amount, setAmount] = useState("1000")
  const [leverage, setLeverage] = useState("50");



  const [balance, setBalance] = useState(null)



  const [betInfo, setBetInfo] = useState({
    pnl: "",
    amount: "",
    entryPrice: "",
    lastPrice: "",
    active: false,
    token: "",
    leverage: 0,
    position: 0,
  });

  const [tradeHistory, setTradeHistory] = useState([]);

  const tokenAddress = "0x46Df714bA0aD9A8Ed3D7Feb769e1D7D20451D8Ca"; //USDC Token

  const contractAddress = "0x6eAF9C42662c38316A9b07A71a57e530259B580b"; //Contract Dex


  const { address, chainId, isConnected } = useWeb3ModalAccount()

  const { signer } = useWeb3ModalSigner()

  const handleClick = async () => {
    open({ view: "Account" })



  }


  const onLoadScriptRef = useRef();


  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (
        document.getElementById("tradingview_e0f82") &&
        "TradingView" in window
      ) {
        let chartWidget = new window.TradingView.widget({
          autosize: true,
          symbol: "BINANCE:BTCUSDT",
          interval: "15",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          withdateranges: true,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: "tradingview_e0f82",
          onChartReady: function () {
            console.log("Chart is ready!"); // Thêm dòng này
            const chart = this.chart();
            chart.subscribeCrosshairMove((param) => {
              if (param.point) {
                console.log("Price Entry:", param.point.price);
              }
            });
          },
        });
      }
    }
  }, []);

  useEffect(() => {
    const fetchBetInfo = async () => {

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const abi = futuresDexJson;
        const contract = new ethers.Contract(contractAddress, abi, signer);


        const info = await contract.bets(signer.getAddress());




        const amountString = info.amount.toString();
        const entryPriceString = info.entryPrice.toString();

        const lastPrice = await contract.getLatestPrice();
        const lastPriceString = lastPrice.toString();

        let decimals = 18;
        let pnlDecimal;
        if (entryPriceString > 0) {
          const pnlBigNumber = await contract.calculatePnL(signer.getAddress());
          pnlDecimal = parseFloat(
            ethers.utils.formatUnits(pnlBigNumber, decimals)
          );
        }

        if (betInfo.pnl !== pnlDecimal) {
          setBetInfo({
            ...info,
            position: info.position,
            lastPrice: lastPriceString / 1e8,
            pnl: pnlDecimal,
            amount: amountString / 1e18,
            entryPrice: entryPriceString / 1e8,
          });



        }
      } catch (error) {
        console.log(error);
      }
    };

    const intervalId = setInterval(fetchBetInfo, 1000);

    return () => clearInterval(intervalId);
  }, [betInfo.pnl]);

  //get History
  //get History

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const abi = futuresDexJson;
        const contract = new ethers.Contract(contractAddress, abi, signer);


        const tradeCount = await contract.userTradeCounts(signer.getAddress());
        const tradeNum = tradeCount.toNumber();

        const allTrades = [];

        for (let i = 0; i < tradeCount; i++) {
          const trade = await contract.userTrades(signer.getAddress(), i);
          const exitPriceString = trade.exitPrice.toString();
          const entryPriceString = trade.entryPrice.toString();
          const pnlString = trade.pnl.toString();
          const timestampString = trade.timestamp.toString();
          let data = {
            timestamp: timestampString ,
            entryPrice: entryPriceString / 1e8,
            exitPrice: exitPriceString / 1e8,
            pnl: pnlString / 1e18,
          };

          allTrades.push(data)
        }
        setTradeHistory(allTrades)

        console.log(allTrades);

   
      } catch (error) {
        console.log("Error fetching trade history:", error);
      }
    };

    fetchTradeHistory();
  }, []);


  useEffect(() => {
    console.log({tradeHistory});
  }, [tradeHistory]);
  



  //get USDC balance
  useEffect(() => {

    const fetchBanlance = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contractUSDC = new ethers.Contract(tokenAddress, ['function balanceOf(address) view returns (uint256)'], provider);

      const balance = await contractUSDC.balanceOf(signer.getAddress());

      const balanceValue = balance.toString();

      setBalance(balanceValue / 1e18)



    }
    fetchBanlance()

  }, [])
  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-bold text-3xl">

          FeatureDex
        </h1>

        <Button onClick={handleClick} variant="outline" size="lg" className={cn(
          "text-white w-full font-semibold border-none gradient-btn",
          "hover:text-white",
          "w-18"
        )}>
          <span>Connect Wallet</span>
          <Sparkles />
        </Button>
        <div className="flex">
          <w3m-network-button />
          <w3m-button balance='hide' />

        </div>

      </div>

      <div className="w-full flex mt-6">
        <div className='flex-1'>
          <div className="tradingview-widget-container">
            <div style={{ height: "600px" }} id="tradingview_e0f82" />
          </div>
        </div>
        <div className='ml-2'>
          <Tabs defaultValue="long">
            <TabsList>
              <TabsTrigger aria-selected={true} style={{ width: "150px" }} value="long">Long</TabsTrigger>
              <TabsTrigger style={{ width: "150px" }} value="sort">Short</TabsTrigger>
            </TabsList>
            <TabsContent value="long">
              <div

                className="flex items-center w-full relative"
              >

                <Textarea
                  placeholder="Enter amount"
                  value={amount}
                  style={{ height: "45px", paddingTop: '10px', fontSize: "16px" }}
                  className="min-h-1 resize-none h-12"
                  // onKeyDown={handleKeyDown}
                  onChange={(e) => setAmount(e.target.value)}

                />
                <Image
                  className='absolute right-2'
                  src="./icons/usdc.png"
                  width={25}
                  height={25}
                  alt="src"
                />



              </div>
              <div

                className="mt-2 flex items-center w-full relative"
              >

                <Textarea
                  placeholder="Enter amount"
                  value={leverage}
                  style={{ height: "45px", paddingTop: '10px', fontSize: "16px" }}
                  className="min-h-1 resize-none h-12"
                  // onKeyDown={handleKeyDown}
                  onChange={(e) => setLeverage(e.target.value)}

                />
                <Image className='absolute right-2' alt="Feature Dex" loading="lazy" width="24" height="24" src="/icons/dex.svg" />



              </div>

              <div style={{ justifyContent: "space-evenly" }} className='mt-2 flex justify-evenly'>
                <Button onClick={() => { }} variant="outline" size="lg" className={cn(
                  "text-white w-full font-semibold border-none gradient-btn",
                  "hover:text-white",
                  "w-18 h-9 mt-2"
                )}>
                  <span> Bet</span>
                  <Sparkles />
                </Button>
              
              </div>
            </TabsContent>
            <TabsContent value="sort">Change your password here.</TabsContent>
          </Tabs>

        </div>
      </div>
      <div className="mt-2 custom-w">

        <div className='w-full'>
          <Tabs defaultValue="positions" className="">
            <TabsList className=''>
              <TabsTrigger aria-selected={true} style={{ width: "150px" }} value="positions">Positions</TabsTrigger>
              <TabsTrigger style={{ width: "150px" }} value="order">Order History</TabsTrigger>
            </TabsList>
            <TabsContent value="positions">
              <div

                className="flex items-center w-full relative justify-between"
              >
                <div className='text-sm text-center w-32'>Order ID</div>
                <div className='text-sm text-center w-32'>Entry Price</div>

                <div className='text-sm text-center w-32'>Symbol</div>

                <div className='text-sm text-center w-32'>Leverage</div>
                <div className='text-sm text-center w-32'>Value</div>


                <div className='text-sm text-center w-32'>Action</div>
                <div className='text-sm text-center w-32'>PnL</div>
                <div className='text-sm text-center w-32'>Action</div>


              </div>
              <div className='flex items-center w-full relative justify-between'>
                <div style={{ fontSize: "14px" }} className='text-sm text-center w-32'>1576996323453</div>
                <div style={{ fontSize: "14px" }} className='text-sm text-center w-32'>{betInfo.entryPrice}</div>
                <div style={{ fontSize: "14px" }} className='text-sm text-center w-32'>USDC</div>

                <div style={{ fontSize: "14px" }} className='text-sm text-center w-32'>x{betInfo.leverage}</div>
                <div style={{ fontSize: "14px" }} className='text-sm text-center w-32'>${betInfo.amount}</div>


                <div style={{ fontSize: "14px" }} className='text-sm text-center w-32'>{betInfo.position === 0 ? "Long" : "Short"}</div>

                <div style={{ fontSize: "14px", color: betInfo.pnl > 0 ? "#03ff03" : "red" }} className={cn("text-sm text-center font-bold w-32")}>${Number(betInfo.pnl).toFixed(2)}</div>
                <div className='text-sm text-center py-2 w-32 opacity-80'>
                    <Button style={{ backgroundColor: "#e649a1" }} onClick={() => { }} variant="outline" size="lg" className={cn(
                  "text-white w-full font-semibold border-none ",
                  "hover:text-white",
                  "w-18 h-8",

                )}>
                  <span>Close</span>
                  <Sparkle />
                </Button>
                    </div>
              </div>



            </TabsContent>
            <TabsContent value="order">  <div

              className="flex items-center w-full relative justify-between"
            >
              <div className='text-sm text-center w-32'>Order ID</div>
              <div className='text-sm text-center w-32'>Time</div>
              <div className='text-sm text-center w-32'>Entry Price</div>

              <div className='text-sm text-center w-32'>Last Price</div>


              <div className='text-sm text-center w-32'>Value</div>



              <div className='text-sm text-center w-32'>PnL</div>
            


            </div>
              {
                tradeHistory.map((item, index) => (
                  
                  
                  <div key={index+1} className='flex items-center w-full relative justify-between'>
                    <div className='text-sm text-center py-2 w-32 opacity-80'>{item.timestamp}</div>
                    <div className='text-sm text-center py-2 w-34 opacity-80'> {new Date(item.timestamp * 1000).toLocaleString()}</div>
                    <div className='text-sm text-center py-2 w-32 opacity-80'>{item.entryPrice}</div>
                    <div className='text-sm text-center py-2 w-32 opacity-80'>{item.entryPrice}</div>
                    <div className='text-sm text-center py-2 w-32 opacity-80'>${item.amount}</div>
                    <div style={{ color: item.pnl > 0 ? "#03ff03" : "red" }} className="text-center font-bold w-32 text-sm">{item.pnl.toFixed(2)}</div>
                 
                  </div>
                ))
              }
              

            </TabsContent>
          </Tabs>

        </div>
      </div>

    </div>
  )
}

export default FeatureDex