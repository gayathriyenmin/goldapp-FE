// Simple toast utility mock
// In a real app, you might use react-hot-toast or similar
export const toast = {
  success: (message: string) => {
    console.log(`%c SUCCESS: ${message}`, 'color: #22C55E; font-weight: bold;');
    alert(`SUCCESS: ${message}`);
  },
  error: (message: string) => {
    console.log(`%c ERROR: ${message}`, 'color: #EF4444; font-weight: bold;');
    alert(`ERROR: ${message}`);
  },
  info: (message: string) => {
    console.log(`%c INFO: ${message}`, 'color: #D4AF37; font-weight: bold;');
    alert(`INFO: ${message}`);
  },
};
