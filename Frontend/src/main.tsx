import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Start MSW mock server in development
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
      quiet: false, // Set to true to suppress console logs
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    }).catch((error) => {
      console.warn('MSW failed to start:', error);
    });
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
