// src/accounting.js
import { inr, sanitize } from './utils.js';
import { invoices, expenses } from './state.js';

/**
 * Render the accounting summary and expense table.
 * This was previously inline in startup-crm.html.
 */
export function renderAccounting() {
  try {
    const income = invoices.filter(i => i.status === 'Paid').reduce((a, i) => a + (i.total || 0), 0);
    const expense = expenses.reduce((a, e) => a + (e.amount || 0), 0);
    const gst = invoices.filter(i => i.status === 'Paid').reduce((a, i) => a + (i.gst_amt || 0), 0);
    const profit = income - expense;

    document.getElementById('acc-inc').textContent = inr(income);
    document.getElementById('acc-exp').textContent = inr(expense);
    document.getElementById('acc-profit').textContent = inr(profit);
    document.getElementById('acc-profit').style.color = profit >= 0 ? 'var(--accent2)' : 'var(--danger)';
    document.getElementById('acc-gst2').textContent = inr(gst);

    const tbody = document.getElementById('expenses-body');
    if (!expenses.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No expenses yet</div></td></tr>`;
    } else {
      tbody.innerHTML = expenses.map(e => `<tr>
        <td>${e.date}</td>
        <td>
          <div style="font-weight:500">${sanitize(e.description)}</div>
          ${e.paid_to ? `<div style="font-size:10px;color:var(--text3)">Paid to: ${sanitize(e.paid_to)}</div>` : ''}
        </td>
        <td><span class="badge badge-new">${sanitize(e.category)}</span></td>
        <td style="font-family:'DM Mono',monospace;font-weight:500">${inr(e.amount)}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="delExpense('${e.id}')">✕</button>
        </td>
      </tr>`).join('');
    }

    const cats = {};
    expenses.forEach(e => {
      cats[e.category] = (cats[e.category] || 0) + (e.amount || 0);
    });

    const invRows = invoices.filter(i => i.status === 'Paid').reduce((a, i) => a + (i.subtotal || 0), 0);
    document.getElementById('pl-summary').innerHTML = `
      <div class="pl-section"><div class="pl-section-title" style="color:var(--accent2)">Income</div>
        <div class="pl-row"><span>Invoice revenue (excl. GST)</span><span style="color:var(--accent2)">${inr(invRows)}</span></div>
        <div class="pl-row"><span>GST collected</span><span style="color:var(--accent2)">${inr(gst)}</span></div>
      </div>
      <div class="pl-section"><div class="pl-section-title" style="color:var(--danger)">Expenses</div>
        ${Object.entries(cats).map(([k, v]) => `<div class="pl-row"><span>${sanitize(k)}</span><span style="color:var(--danger)">${inr(v)}</span></div>`).join('')}
      </div>
      <div class="pl-section" style="background:${profit >= 0 ? 'rgba(74,222,128,0.05)' : 'rgba(248,113,113,0.05)'}">
        <div class="pl-row" style="font-size:15px;font-weight:600">
          <span>Net profit / loss</span>
          <span style="color:${profit >= 0 ? 'var(--accent2)' : 'var(--danger)'}">${inr(profit)}</span>
        </div>
      </div>`;
  } catch (err) {
    console.error('Failed to render accounting:', err);
  }
}
