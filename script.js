// Read More / Read Less (used on small screens; details are always visible on desktop)
const toggle = document.querySelector('.more-toggle');
const more = document.getElementById('more');

toggle.addEventListener('click', () => {
  const open = more.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Read Less' : 'Read More';
});

// Live clock in the side rail
const clock = document.getElementById('clock');
const tick = () => { clock.textContent = new Date().toLocaleTimeString('en-GB'); };
tick();
setInterval(tick, 1000);

// Back to top
const topLink = document.getElementById('top');
window.addEventListener('scroll', () => { topLink.hidden = window.scrollY < 400; }, { passive: true });
topLink.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0 }); });

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Project popup: clicking an image opens its details
const dialog = document.getElementById('project-modal');
const modalBody = dialog.querySelector('.modal-body');

document.querySelectorAll('[data-project]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const tpl = document.getElementById('project-' + btn.dataset.project);
    modalBody.replaceChildren(tpl.content.cloneNode(true));
    modalBody.scrollTop = 0;
    document.body.classList.add('modal-open');
    dialog.showModal();
  });
});

dialog.querySelector('.modal-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); }); // click outside
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));

// Email button: copy the address to the clipboard on click
const emailBtn = document.querySelector('.copy-email');
const copyStatus = document.getElementById('copy-status');
let copyTimer;

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers/contexts without the Clipboard API
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch {}
    ta.remove();
    return ok;
  }
}

emailBtn.addEventListener('click', async () => {
  const ok = await copyText(emailBtn.dataset.email);
  copyStatus.textContent = ok ? 'Email address copied' : 'Copy failed. Email address: ' + emailBtn.dataset.email;
  if (!ok) return;
  emailBtn.classList.add('is-copied');
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    emailBtn.classList.remove('is-copied');
    copyStatus.textContent = '';
  }, 1600);
});