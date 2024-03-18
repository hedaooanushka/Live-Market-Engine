import { useState } from 'react'
import Headers from './Components/Headers.jsx'  
import Search from './Components/Search.jsx'  
import CompanyInfo from './Components/CompanyInfo.jsx'
import Tabs from './Components/Tabs.jsx'




function App() {

  return (
    <>
      <Headers/>
      <br/>
      <Search/>
      <p style={{textAlign: 'center', backgroundColor: '#eee', marginBottom:'0px', height: '50px'}}><b style={{position:'relative', top:'12px'}}>Powered by: <a href="https://finnhub.io">FinnHub.io</a></b></p>
    </>
  )
}

export default App
