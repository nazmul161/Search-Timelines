import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/home'
import Results from './pages/results'
import SavedDocsList from './pages/saveddocslist';
import Topics from './pages/topics';
import './App.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';

// Definition of the app's theme. you can change the app colors here.
const theme = createTheme({
  palette: {
    primary: {
      main: "#59b6c7",
    },
    secondary: {
      main: "#444",
    },
    tertiary: {
      main: "#c70000",
    },
  },
});

// This const keeps the user's information in the local storage if they logged in.
const userobj=(localStorage.getItem('user')!=""&&localStorage.getItem('user')!=null ? JSON.parse(localStorage.getItem('user')) : {});

// This is the main App function.
// If you wanted to define a new route, please notice that you have to add userobj, which is a object that keeps the user's information, as a prop to the route's component.
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
          <Routes>
            <Route path='/' element={<Home userobj={userobj} />}/>
            <Route path='/results' element={<Results userobj={userobj} />} />
            <Route path='/saveddocslist' element={<SavedDocsList userobj={userobj} />} />
            <Route path='/topicslist' element={<Topics userobj={userobj} />} />
          </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
