import { Router } from './routes/private/router';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <div className="app">
      <ErrorBoundary>
        <Router />
      </ErrorBoundary>
    </div>
  );
}