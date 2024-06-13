import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UseResources from './pages/UseResources'
import NavBar from './components/navbar';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/real" element={<UseResources />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App