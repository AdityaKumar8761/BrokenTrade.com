import './css-pages/HomePage.css'
import { Header } from '../components/Header'
import { StockTicker } from '../components/StockTicker'
import { Hero } from '../components/Hero'
import { HomePageMid } from '../components/HomePageMid'
import { CourseMarquee } from '../components/CourseMarquee'
import { HomePageFutter } from '../components/HomePageFutter'

export function HomePage() {
  return (
    <div className="home-page">
      <Header />
      <StockTicker />
      <Hero />
      <HomePageMid />
      <CourseMarquee />
      <HomePageFutter />
    </div>
  )
}