// import { useState } from 'react'
import { Dashboard } from "./pages/Dashboard"
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom"
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />}></Route>
        <Route path="/Signup" element={<Signup />}></Route>
        <Route path="/Signin" element={<Signin />}></Route>
        <Route path="/Dashboard" element={<Dashboard />}></Route>
      </Routes>
    </BrowserRouter>

  )
}


// function Layout(){
//   return (

//   )
// }


export default App