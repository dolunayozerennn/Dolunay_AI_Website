import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { SolutionsPage } from './pages/SolutionsPage';
import { CollaborationsPage } from './pages/CollaborationsPage';
import { AboutPage } from './pages/AboutPage';
import './index.css';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      let hash = window.location.hash || '#/';
      if (hash.includes('?')) hash = hash.split('?')[0]; // strip query
      const route = hash.split('#')[1] || '/';
      setCurrentPath(route.startsWith('/') ? '#' + route : hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const route = currentPath.split('#')[1] || '/';
  
  // Decide which page component to render based on the hash string
  let CurrentPage = HomePage;
  if (route === '/cozumler' || route.startsWith('/cozumler/')) {
    CurrentPage = SolutionsPage;
  } else if (route === '/isbirlikleri' || route.startsWith('/isbirlikleri/')) {
    CurrentPage = CollaborationsPage;
  } else if (route === '/hakkimizda' || route.startsWith('/hakkimizda/')) {
    CurrentPage = AboutPage;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-purple-500/30">
      <Navbar />
      
      <main className="pt-20">
        <CurrentPage />
      </main>

      <Footer />
    </div>
  );
}

export default App;
