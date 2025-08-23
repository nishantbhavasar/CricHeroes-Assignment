import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
const Home = lazy(() => import("./pages/Home"));

function App() {
  return (
    <Router>
      <Suspense fallback={<span></span>}>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
