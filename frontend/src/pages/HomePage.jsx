import './css-pages/HomePage.css' 
import { Header } from'../components/Header'

export function HomePage(){
  return (
    <>
      <Header/>
      <div style={{ height: "200vh" }}>
        <h1>Scroll down</h1>
      </div>
    </>
  )
}