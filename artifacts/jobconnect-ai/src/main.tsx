import { createRoot } from 'react-dom/client';
import { setAuthTokenGetter } from "@workspace/api-client-react";
import App from './App';
import './index.css';

// Set auth token getter for API client queries and mutations
setAuthTokenGetter(() => localStorage.getItem("jwtToken"));

createRoot(document.getElementById('root')!).render(<App />);
