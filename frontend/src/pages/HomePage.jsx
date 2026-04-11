import './css-pages/HomePage.css'
import { Header } from '../components/Header'
import { StockTicker } from '../components/StockTicker'
import { Hero } from '../components/Hero'
import { HomePageMid } from '../components/HomePageMid'
import { HomePageFutter } from '../components/HomePageFutter'

export function HomePage() {
  return (
    <div className="home-page">
      <Header />
      <StockTicker />
      <Hero />
      <HomePageMid />
      <HomePageFutter />
    </div>
  )
}