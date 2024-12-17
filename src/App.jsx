import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import Navbar from './components/nav/Navbar'; // Assuming Navbar is in this path

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Now Navbar can use react-router links for navigation */}
    </Router>
  );
}

export default App;
