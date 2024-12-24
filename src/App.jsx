import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch
import Navbar from "./components/nav/Navbar";
import Marquee from "./components/marquee/Marquee";
import Ranking from "./components/ranking/Ranking";
import CreateToken from './pages/createToken/CreateToken';
import Footer from './components/footer/Footer';
import CardPage from './pages/cardpage/CardPage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Marquee />

      {/* Routing for different pages */}
      <Routes>
        {/* Route for the Ranking page */}
        <Route path="/" element={<Ranking />} />
        <Route path="/card-page" element={<CardPage />} />
        <Route path="/create-token" element={<CreateToken />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
