import { Toaster } from 'react-hot-toast';
import { AppRouter } from './router';

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      <AppRouter />
    </div>
  );
}

export default App;
