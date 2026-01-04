import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

function InvoiceForm() {
  const [form, setForm] = useState({
    invoice_number: '',
    client_name: '',
    date: '',
    amount: '',
    status: 'Pending'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchInvoice(id);
    }
  }, [id]);

  const fetchInvoice = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/invoices`);
      const data = await response.json();
      const invoice = data.find(inv => inv.id == id);
      if (invoice) {
        setForm(invoice);
      }
    } catch (err) {
      console.error('Failed to fetch invoice');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.invoice_number || !form.client_name || !form.date || !form.amount || !form.status) {
      setError('All fields are required');
      return;
    }
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `http://localhost:5000/api/invoices/${id}` : 'http://localhost:5000/api/invoices';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        navigate('/home');
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to save invoice');
    }
  };

  return (
    <div className="invoice-form">
      <h2>{id ? 'Edit Invoice' : 'Add Invoice'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="invoice_number"
          placeholder="Invoice Number"
          value={form.invoice_number}
          onChange={handleChange}
          required
        />
        <input
          name="client_name"
          placeholder="Client Name"
          value={form.client_name}
          onChange={handleChange}
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Pending">Pending</option>
        </select>
        <button type="submit">{id ? 'Update' : 'Add'} Invoice</button>
        {error && <p className="error">{error}</p>}
      </form>
      <Link to="/home">Back to Home</Link>
    </div>
  );
}

export default InvoiceForm;