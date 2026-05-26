// src/utils.js
export const inr = n => '₹' + Math.round(n || 0).toLocaleString('en-IN');
export const today = () => new Date().toISOString().split('T')[0];
export const sanitize = str => {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};
export const toast = msg => {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
};
export const dbOp = async (fn, errorMsg = 'Sync error') => {
  try {
    const result = await fn();
    if (result.error) {
      toast(errorMsg + ': ' + (result.error.message || 'Unknown error'));
      return { error: result.error, data: null };
    }
    return result;
  } catch (err) {
    toast(errorMsg + ': ' + err.message);
    return { error: err, data: null };
  }
};
