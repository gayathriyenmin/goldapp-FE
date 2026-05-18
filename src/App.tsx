import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './router';
import { useThemeStore } from './store';

function App() {
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.style.colorScheme = 'light';
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.style.colorScheme = 'dark';
    }
  }, [theme]);

  return (
    <div className="App">
      <Toaster position="top-right" />
      <AppRouter />
    </div>
  );
}

export default App;
