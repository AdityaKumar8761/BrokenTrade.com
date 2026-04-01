import './css-pages/HomePage.css' 
import { Header } from'../components/Header'
import { StockTicker } from '../components/StockTicker'
import { Hero } from '../components/Hero'
import { HomePageMid } from '../components/HomePageMid'

export function HomePage(){
  return (
    <>
      <div style={{ height: "200vh" }}>
      <Header/>
      <StockTicker/>
      <Hero/>
      <HomePageMid/>
      </div>
    </>
  )
}