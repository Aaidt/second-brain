// import { useState } from 'react'
import { Dashboard } from "./pages/Dashboard"
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom"
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import { ProtectedRoute } from "./pages/ProtectedRoute"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
        </Route>
      </Routes>
    </BrowserRouter>

  )
}


// function Layout(){
//   return (

//   )
// }


export default App