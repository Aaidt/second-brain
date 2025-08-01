import { Dashboard } from "./pages/Dashboard"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import { LandingPage } from "./pages/LandingPage"
import { PricingPage } from "./pages/PricingPage"
import { SharedBrainPage } from "./pages/SharedBrainPage"
import { ProtectedRoute } from "./pages/ProtectedRoute"
import { SidebarProvider } from "./hooks/sidebarContext"
import { Chat } from "./pages/Chat"
import { QueryThoughts } from "./pages/QueryThoughts"
import { ThemeProvider } from "@/components/ui/theme-provider"
// import { VectorGraph } from "./pages/VectorGraph"



function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/pricing" element={<PricingPage />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/share/  :shareLink" element={
            <SidebarProvider isSharedPage={true}>
              <SharedBrainPage />
            </SidebarProvider>}
          />
          <Route path="/dashboard" element={
              <ProtectedRoute>
                <SidebarProvider isSharedPage={false}><Dashboard /></SidebarProvider>
              </ProtectedRoute>
            }>
          </Route>
          
          <Route path="/query" element={<ProtectedRoute><QueryThoughts /></ProtectedRoute>}></Route>

          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>}></Route>

          {/* <Route path="/visualise"
            element={
              <ProtectedRoute>
                <VectorGraph />
              </ProtectedRoute>
            }>
          </Route> */}

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App