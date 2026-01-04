import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    let filtered = invoices;
    if (filter) {
      filtered = invoices.filter(inv => inv.status === filter);
    }
    filtered.sort((a, b) => {
      if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount') return a.amount - b.amount;
      return 0;
    });
    setFilteredInvoices(filtered);
  }, [invoices, filter, sortBy]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5000/api/invoices');
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      const data = await response.json();
      setInvoices(data);
    } catch (err) {
      setError('Failed to load invoices. Please check if the backend is running.');
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete invoice');
      }
      fetchInvoices();
    } catch (err) {
      setError('Failed to delete invoice.');
      console.error('Failed to delete invoice:', err);
    }
  };

  return (
    <div className="home">
      <header style={{width: '100%', textAlign: 'center', marginBottom: '20px'}}>
        <h1>Invoice Management System</h1>
        <p>Welcome! Manage your invoices below.</p>
      </header>
      <div className="controls">
        <Link to="/invoice">
          <button className="add-invoice-btn">Add New Invoice</button>
        </Link>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Pending">Pending</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>
      {loading && <p className="loading">Loading invoices...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {filteredInvoices.map((inv, index) => (
          <li key={inv.id} style={{animationDelay: `${index * 0.1}s`}}>
            <div className="invoice-details">
              <strong>{inv.invoice_number}</strong> - {inv.client_name} - {inv.date} - ${inv.amount} - <span className={`status-badge status-${inv.status.toLowerCase()}`}>{inv.status}</span>
            </div>
            <div className="invoice-actions">
              <Link to={`/invoice/${inv.id}`}>
                <button className="edit-btn">Edit</button>
              </Link>
              <button className="delete-btn" onClick={() => deleteInvoice(inv.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;