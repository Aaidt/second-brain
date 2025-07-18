import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')!).render(
  <div>
    <App />
    <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          pauseOnFocusLoss
          pauseOnHover
          theme="dark"
          transition={Zoom}
        />
  </div>
)
