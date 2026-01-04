import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import InvoiceForm from './components/InvoiceForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/invoice" element={<InvoiceForm />} />
          <Route path="/invoice/:id" element={<InvoiceForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
