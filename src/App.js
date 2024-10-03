import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ChartComponent from './components/ChartComponent';
import 'bootstrap/dist/css/bootstrap.min.css';

const coins = [
  { symbol: 'ethusdt', display: 'ETH/USDT' },
  { symbol: 'bnbusdt', display: 'BNB/USDT' },
  { symbol: 'dotusdt', display: 'DOT/USDT' },
];

const intervals = [
  { value: '1m', label: '1 Minute' },
  { value: '3m', label: '3 Minute' },
  { value: '5m', label: '5 Minute' },
];

function App() {
  const [selectedCoin, setSelectedCoin] = useState('ethusdt');
  const [selectedInterval, setSelectedInterval] = useState('1m');
  const [candlestickData, setCandlestickData] = useState({});
  const ws = useRef(null);

  // Fetch data from localStorage 
  useEffect(() => {
    const storedData = localStorage.getItem(`${selectedCoin}-${selectedInterval}`);
    if (storedData) {
      setCandlestickData(JSON.parse(storedData));
    }
  }, [selectedCoin, selectedInterval]);

  useEffect(() => {
    const wsUrl = `wss://stream.binance.com:9443/ws/${selectedCoin}@kline_${selectedInterval}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Extract data
      const { t: time, o: open, h: high, l: low, c: close } = message.k;
      const newCandle = { time, open, high, low, close };

      setCandlestickData((prevData) => {
        const updatedData = { ...prevData };
        if (!updatedData[selectedCoin]) {
          updatedData[selectedCoin] = [];
        }
        updatedData[selectedCoin].push(newCandle);

        // Store data in localStorage 
        localStorage.setItem(`${selectedCoin}-${selectedInterval}`, JSON.stringify(updatedData));
        return updatedData;
      });
    };

    return () => {
      ws.current.close();
    };
  }, [selectedCoin, selectedInterval]);

  const handleCoinChange = (e) => {
    setSelectedCoin(e.target.value);
  };

  const handleIntervalChange = (e) => {
    setSelectedInterval(e.target.value);
  };

  return (
    <div className="App">
      <div className="container mt-4">
        <h1>Binance Market Data</h1>

      
        <div className="row my-4">
          <div className="col-md-6">
            <label htmlFor="coin" className="form-label">Select Coin: </label>
            <select
              id="coin"
              className="form-select"
              onChange={handleCoinChange}
              value={selectedCoin}
            >
              {coins.map((coin) => (
                <option key={coin.symbol} value={coin.symbol}>
                  {coin.display}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="interval" className="form-label">Select Interval: </label>
            <select
              id="interval"
              className="form-select"
              onChange={handleIntervalChange}
              value={selectedInterval}
            >
              {intervals.map((interval) => (
                <option key={interval.value} value={interval.value}>
                  {interval.label}
                </option>
              ))}
            </select>
          </div>
        </div>

      
        <ChartComponent
          data={candlestickData[selectedCoin] || []}
          coin={selectedCoin}
          interval={selectedInterval}
        />
      </div>
    </div>
  );
}

export default App;
