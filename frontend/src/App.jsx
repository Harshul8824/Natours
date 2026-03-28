import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import TourDetails from './pages/TourDetails';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tour/:slug" element={<TourDetails />} />
          {/* We'll add more routes later */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;