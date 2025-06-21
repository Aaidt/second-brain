import { Dashboard } from "./pages/Dashboard"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import { LandingPage } from "./pages/LandingPage"
import { PricingPage } from "./pages/PricingPage"
import { SharedBrainPage } from "./pages/SharedBrainPage"
import { ProtectedRoute } from "./pages/ProtectedRoute"
import { SidebarProvider } from "./hooks/sidebarContext"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/pricing" element={<PricingPage />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/:shareLink" element={
          <SidebarProvider>
            <SharedBrainPage />
          </SidebarProvider>}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <SidebarProvider>
                <Dashboard />
              </SidebarProvider>
            </ProtectedRoute>
          }>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App