import Context from './comp/context'
import LoginPage from './comp/login'
import './App.css'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import HomePage from './comp/homePage'
import '@knadh/oat/oat.min.css';
import '@knadh/oat/oat.min.js';
import TiptapEditor from './comp/EditorPage'
import '@syncfusion/ej2-react-documenteditor/styles/material.css';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
const queryClient=new QueryClient()

function App() {

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Context>
            <Routes>
              <Route path='/' element={<LoginPage />} />
              <Route path="home" element={<HomePage />} />
              <Route path="editor/:docId" element={<TiptapEditor />} />
            </Routes>

          </Context>
          <ToastContainer />
        </BrowserRouter>
      </QueryClientProvider>

    </div>
  )
}

export default App
