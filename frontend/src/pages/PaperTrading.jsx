import './css-pages/PaperTrading.css';
import { Header } from '../components/Header'

export function PaperTrading() {
  return (
    <>
    <Header/>
      <div className="stocksPage">

        {/* LEFT CARD */}
        <div className="card simulator">
          <h2>Paper Trading Simulator</h2>

          <p>Virtual Balance: <strong>$100,000</strong></p>

          <div className="pnl">
            <span className="profit">Total P/L: +$2,500.00</span>
            <span>Winning Trades: 12</span>
            <span>Losing Trades: 5</span>
          </div>

          <h3>Current Holdings</h3>

          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Qty</th>
                <th>Price</th>
                <th>P/L</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AAPL</td>
                <td>50</td>
                <td>$145.20</td>
                <td className="profit">+$400.00</td>
              </tr>
              <tr>
                <td>TSLA</td>
                <td>30</td>
                <td>$720.50</td>
                <td className="loss">-$180.00</td>
              </tr>
              <tr>
                <td>AMZN</td>
                <td>20</td>
                <td>$3350.80</td>
                <td className="profit">+$300.00</td>
              </tr>
            </tbody>
          </table>

          <div className="buttons">
            <button className="buy">Buy Stock</button>
            <button className="sell">Sell Stock</button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="rightSide">

          {/* LEARNING */}
          <div className="card learning">
            <h2>Learning Resources</h2>

            <div className="grid">
              <div className="item">Technical Analysis</div>
              <div className="item">Fundamental Analysis</div>
              <div className="item">Trading Strategies</div>
              <div className="item">Risk Management</div>
            </div>
          </div>

          {/* CHART */}
          <div className="card chart">
            <h2>AAPL Stock Chart</h2>

            <div className="chartBox">
              📈 Chart Placeholder
            </div>

            <button className="tradeBtn">Trade</button>
          </div>

        </div>

      </div>
    </>
  );
}