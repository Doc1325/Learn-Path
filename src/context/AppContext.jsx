import { createContext, useContext, useReducer } from 'react';


const initialState = {
    user: null,
    loginStatus: false,
    screen: 'login', // 'login', 'generator', 'app'
    currentPath: null
};

const AppContext = createContext(null);


function AppReducer(state, action) {
  switch (action.type) {

    case 'SET_USER':
        return { ...state, user: action.payload };
    case 'SET_LOGIN_STATUS':
      return { ...state, loginStatus: action.payload };

    case 'SET_SCREEN':
      return { ...state, screen: action.payload };

    case  'SET_PATH':
      return { ...state, currentPath: action.payload };

    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};


export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
};