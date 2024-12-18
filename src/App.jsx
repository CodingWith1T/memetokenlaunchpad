import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch
import Navbar from "./components/nav/Navbar";
import Marquee from "./components/marquee/Marquee";
import Ranking from "./components/ranking/Ranking";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Marquee />

      {/* Routing for different pages */}
      <Routes>
        {/* Route for the Ranking page */}
        <Route path="/" element={<Ranking />} />
      </Routes>
    </Router>
  );
}

export default App;
