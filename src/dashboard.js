// src/dashboard.js
export function renderDashboard() {
  try {
    const paid = invoices.filter(i => i.status === 'Paid');
    const pend = invoices.filter(i => i.status === 'Pending');
    const open = leads.filter(l => l.stage !== 'Won' && l.stage !== 'Lost');

    document.getElementById('s-revenue').textContent = inr(paid.reduce((a, i) => a + (i.total || 0), 0));
    document.getElementById('s-deals').textContent = open.length;
    document.getElementById('s-pending').textContent = inr(pend.reduce((a, i) => a + (i.total || 0), 0));
    document.getElementById('s-gst').textContent = inr(paid.reduce((a, i) => a + (i.gst_amt || 0), 0));
  } catch (err) {
    console.error('Dashboard render error:', err);
  }
}
