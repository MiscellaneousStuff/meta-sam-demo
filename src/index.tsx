import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppContextProvider from "./components/hooks/context";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container!);

const router = createBrowserRouter([
  {
    path: "*",
    element: <App />,
  },
]);
root.render(
  <AppContextProvider>
    <RouterProvider router={router} />
  </AppContextProvider>
);

/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
*/
