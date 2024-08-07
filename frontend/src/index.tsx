import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import Home from './Home'
import {Web3ModalProvider} from './libs/walletProvider'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
])
const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Web3ModalProvider>
        <RouterProvider router={router} />
      </Web3ModalProvider>
    </QueryClientProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
