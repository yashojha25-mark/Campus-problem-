document.addEventListener('DOMContentLoaded', function () {
  const featureCards = document.querySelectorAll('.feature-card');
  const aboutHeader = document.querySelector('.about-header');
  const processBox = document.querySelector('.process-box');

  (function injectStyles() {
    const css = `
      .feature-card { transition: transform 220ms ease, box-shadow 220ms ease; }
      .feature-card.active-feature { transform: translateY(-6px); box-shadow: 0 6px 18px rgba(0,0,0,0.08); }
      .feature-card .extra-detail { max-height: 0; overflow: hidden; transition: max-height 280ms ease; }
      .feature-card.expanded .extra-detail { max-height: 240px; }
      .process-list { max-height: 1000px; overflow: hidden; transition: max-height 300ms ease; }
      .process-box.collapsed .process-list { max-height: 0; }
      .toggle-btn { cursor: pointer; display: inline-block; margin-left: 12px; font-size: 0.9rem; padding: 4px 8px; border-radius: 6px; background:#f0f0f0; }
      .form-message { margin-bottom: 8px; }
    `;
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  })();

  if (aboutHeader) {
    const note = document.createElement('p');
    note.className = 'about-note';
    note.textContent = 'Our team reviews every submission carefully to ensure fast, fair results.';
    aboutHeader.appendChild(note);
  }

  featureCards.forEach((card) => {
    const heading = card.querySelector('h3');
    const desc = card.querySelector('p');

    const extra = document.createElement('div');
    extra.className = 'extra-detail';
    extra.textContent = 'We continuously monitor metrics and user feedback to improve response times and outcomes.';
    card.appendChild(extra);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toggle-btn';
    btn.textContent = 'Details';
    btn.setAttribute('aria-expanded', 'false');
    heading.appendChild(btn);

    btn.addEventListener('click', () => {
      const expanded = card.classList.toggle('expanded');
      btn.setAttribute('aria-expanded', String(expanded));
      btn.textContent = expanded ? 'Hide' : 'Details';
    });

    card.addEventListener('mouseenter', function () {
      featureCards.forEach((item) => item.classList.remove('active-feature'));
      card.classList.add('active-feature');
    });

    card.addEventListener('mouseleave', function () {
      card.classList.remove('active-feature');
    });
  });

  if (processBox) {
    const header = processBox.querySelector('h3');
    const list = processBox.querySelector('.process-list');
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'toggle-btn';
    toggle.textContent = 'Hide Steps';
    toggle.setAttribute('aria-expanded', 'true');
    header.appendChild(toggle);

    requestAnimationFrame(() => {
      list.style.maxHeight = list.scrollHeight + 'px';
    });

    toggle.addEventListener('click', () => {
      const collapsed = processBox.classList.toggle('collapsed');
      toggle.textContent = collapsed ? 'Show Steps' : 'Hide Steps';
      toggle.setAttribute('aria-expanded', String(!collapsed));
      
      if (collapsed) {
        list.style.maxHeight = '0px';
      } else {
        list.style.maxHeight = list.scrollHeight + 'px';
      }
    });
  }
});
