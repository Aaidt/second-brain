import { Dashboard } from "./pages/Dashboard"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LandingPage } from "./pages/LandingPage"
import { SharedBrainPage } from "./pages/SharedBrainPage"
import { SidebarProvider } from "./hooks/sidebarContext"
import { Chat } from "./pages/Chat"
import { QueryThoughts } from "./pages/QueryThoughts"
import { ThemeProvider } from "@/components/ui/theme-provider"
import Auth from "./pages/Auth"



function App() {

   return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<LandingPage />}></Route>
               <Route path="/login" element={<Auth />}></Route>
               <Route path="/share/  :shareLink" element={
                  <SidebarProvider isSharedPage={true}>
                     <SharedBrainPage />
                  </SidebarProvider>}
               />
               <Route path="/dashboard" element={
                     <SidebarProvider isSharedPage={false}><Dashboard /></SidebarProvider>
               }>
               </Route>

               <Route path="/query" element={<QueryThoughts />}></Route>

               <Route path="/chat" element={<Chat />}></Route>
            </Routes>
         </BrowserRouter>
      </ThemeProvider>
   )
}

export default App
