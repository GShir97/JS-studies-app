import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import CodeTask from './pages/CodeTask';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/codetask/:id" element={<CodeTask />} />
        <Route path="*" element={<Home />} />
        </Routes>
    </Router>
  );
}
export default App;

/*function App() {
  return <h1>Hello, World!</h1>;
}

export default App;*/



