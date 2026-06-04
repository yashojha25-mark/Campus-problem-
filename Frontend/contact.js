document.addEventListener('DOMContentLoaded', () => {
  console.log('contact.js loaded');
  const i18n = window.campusI18n;
  const form = document.querySelector('.contact-form-box form');
  if (!form) return;
  const $ = s => form.querySelector(s) || document.querySelector(s);
  const name = $('#name'), email = $('#email'), msg = $('#message'), submit = $('.submit-btn') || form.querySelector('button[type=submit]'), info = document.querySelector('.contact-info');

  const style = document.createElement('style');
  style.textContent = '.counter{font-size:.85rem;color:#666;margin-top:6px}.toggle-btn{cursor:pointer;margin-top:8px;padding:4px 8px;border-radius:6px;background:#f0f0f0;border:1px solid #ddd}.sending{opacity:.8}';
  document.head.appendChild(style);

  if (msg) {
    const max = 1000, c = document.createElement('div'); c.className = 'counter';
    const renderCounter = () => { c.textContent = `${Math.max(0, max - msg.value.length)} ${i18n?.t('pages.feedback.counterSuffix') || 'characters'} remaining`; };
    msg.parentNode.appendChild(c);
    msg.addEventListener('input', renderCounter);
    window.addEventListener('campus-language-change', renderCounter);
    renderCounter();
  }

  if (info) {
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'toggle-btn';
    const renderButtonText = (hide) => { btn.textContent = hide ? (i18n?.messages.showInfo() || 'Show Details') : (i18n?.messages.hideInfo() || 'Hide Details'); };
    btn.textContent = i18n?.messages.hideInfo() || 'Hide Details'; info.insertBefore(btn, info.firstChild);
    btn.addEventListener('click', () => { const hide = btn.textContent === (i18n?.messages.hideInfo() || 'Hide Details'); info.querySelectorAll('.info-item').forEach(i => i.style.display = hide ? 'none' : ''); renderButtonText(hide); });
    window.addEventListener('campus-language-change', () => renderButtonText(btn.textContent === (i18n?.messages.showInfo() || 'Show Details')));
  }

  const valid = () => name && email && msg && name.value.trim().length>1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) && msg.value.trim().length>5;
  const toggle = () => { if (submit) submit.disabled = !valid(); };
  [name, email, msg].filter(Boolean).forEach(el => el.addEventListener('input', toggle)); toggle();

  form.addEventListener('submit', e => {
    e.preventDefault(); if (submit && submit.disabled) return;
    if (!valid()) { const existing = form.querySelector('.form-message') || Object.assign(document.createElement('div'), {className:'form-message'}); existing.textContent = i18n?.messages.contactInvalid() || 'Please complete the form correctly.'; existing.style.color = '#c0392b'; form.insertBefore(existing, form.firstChild); return; }
    if (submit) { const orig = submit.textContent; submit.textContent = i18n?.messages.sending() || 'Sending...'; submit.classList.add('sending'); submit.disabled = true; setTimeout(()=>{ form.querySelector('.form-message')?.remove(); const m = document.createElement('div'); m.className='form-message'; m.style.color = '#1f8a70'; m.textContent=i18n?.messages.contactSent() || 'Message sent — we will reply within 24 hours.'; form.insertBefore(m, form.firstChild); form.reset(); msg?.dispatchEvent(new Event('input')); toggle(); submit.textContent = orig; submit.classList.remove('sending'); }, 900); } else { form.reset(); }
  });
});
