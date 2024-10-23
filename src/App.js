import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MemeList from './components/MemeList';
import MemeEditor from './components/MemeEditor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MemeList />} />
        <Route path="/edit/:id" element={<MemeEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
