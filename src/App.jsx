import React, { useState, useEffect, use } from "react";
import './App.css'
import LearningPathApp from "./pages/LearningPath";
import Login from "./pages/Login";
import MainMenu from "./pages/MainMenu";
import PathGenerator from "./components/PathGenerator";
import * as AppContext from './context/AppContext';
// === App principal ===
export default function App() {

  const { state, dispatch } = AppContext.useApp();
  const  {user, loginStatus, screen, currentPath} = state;
  
  


switch (screen) {
  case 'login':
    return <Login />;
    case 'MainMenu':
      return <MainMenu />;
    case 'generator':
      return (
      <PathGenerator />
      );  
      break;
      case 'app':
        return <LearningPathApp />;
    default:
      return <Login />;
}

}
