import { Dashboard } from "./pages/Dashboard"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import { SharedBrainPage } from "./pages/SharedBrainPage"
import { ProtectedRoute } from "./pages/ProtectedRoute"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/:shareLink" element={<SharedBrainPage />} />
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

export default App