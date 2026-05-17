// =========================================================
// PPUQHM Share Buttons — Auto-inject into berita pages
// =========================================================
// Cara pakai: tambahkan <script src="/share-buttons.js" defer></script>
// sebelum </body> di tiap halaman berita.
// Script ini otomatis inject CSS + HTML tombol share + handler.
// =========================================================

(function(){
  // ===== CSS =====
  const css = `
    .share-wrap{max-width:800px;margin:2.5rem auto 0;padding:0 2rem}
    .share-inner{background:linear-gradient(135deg,#0d2218 0%,#1b4332 100%);color:#fff;border-radius:12px;padding:1.75rem 1.5rem;text-align:center;box-shadow:0 6px 18px rgba(13,34,24,.18)}
    .share-title{font-family:'Amiri',serif;font-size:1.2rem;color:#f0c040;margin-bottom:.35rem;font-weight:700;line-height:1.35}
    .share-sub{font-size:12.5px;color:rgba(255,255,255,.72);margin-bottom:1.2rem;font-style:italic}
    .share-buttons{display:flex;flex-wrap:wrap;gap:.55rem;justify-content:center}
    .share-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 18px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;transition:.2s;border:none;cursor:pointer;font-family:'Poppins',sans-serif;color:#fff}
    .share-btn .ico{font-size:1.05rem;line-height:1}
    .share-wa{background:#25d366}
    .share-fb{background:#1877f2}
    .share-tg{background:#26a5e4}
    .share-x{background:#000;border:1px solid rgba(255,255,255,.2)}
    .share-copy{background:rgba(255,255,255,.08);color:#f0c040;border:1px solid rgba(212,160,23,.4)}
    .share-btn:hover{transform:translateY(-2px);box-shadow:0 6px 14px rgba(0,0,0,.3);text-decoration:none}
    .share-copy.copied{background:#d4a017;color:#1b4332;border-color:#d4a017}
    .share-copy.copied .ico:before{content:'✅'}
    @media(max-width:768px){
      .share-wrap{padding:0 1.25rem}
      .share-inner{padding:1.25rem 1rem}
      .share-buttons{gap:.45rem}
      .share-btn{padding:9px 14px;font-size:12.5px}
    }
    @media(max-width:480px){
      .share-btn{flex:1 1 calc(50% - .5rem);justify-content:center;min-width:0}
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ===== Get current page info =====
  const pageUrl = window.location.href.replace(/\.html$/i, '').replace(/\/index$/, '/');
  const pageTitle = document.title.split(' - ')[0].split(' — ')[0].trim();
  const shareText = `📰 ${pageTitle}`;

  const encUrl = encodeURIComponent(pageUrl);
  const encText = encodeURIComponent(shareText);
  const encWaText = encodeURIComponent(`${shareText}\n\n${pageUrl}\n\nBaca berita lengkap dari Pondok Pesantren Ulumul Qur'an Hasyim Muzadi.`);

  // ===== HTML =====
  const html = `
    <div class="share-wrap">
      <div class="share-inner">
        <p class="share-title">📤 Bagikan Berita Ini</p>
        <p class="share-sub">Sebar ilmu, raih pahala — bagikan ke saudara/jamaah</p>
        <div class="share-buttons">
          <a href="https://wa.me/?text=${encWaText}" target="_blank" rel="noopener" class="share-btn share-wa" aria-label="Bagikan via WhatsApp">
            <span class="ico">💬</span> WhatsApp
          </a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encUrl}" target="_blank" rel="noopener" class="share-btn share-fb" aria-label="Bagikan via Facebook">
            <span class="ico">📘</span> Facebook
          </a>
          <a href="https://t.me/share/url?url=${encUrl}&text=${encText}" target="_blank" rel="noopener" class="share-btn share-tg" aria-label="Bagikan via Telegram">
            <span class="ico">✈️</span> Telegram
          </a>
          <a href="https://twitter.com/intent/tweet?url=${encUrl}&text=${encText}" target="_blank" rel="noopener" class="share-btn share-x" aria-label="Bagikan via Twitter/X">
            <span class="ico">𝕏</span> Twitter
          </a>
          <button type="button" class="share-btn share-copy" data-share="copy" aria-label="Salin link berita">
            <span class="ico">📋</span> <span class="lbl">Salin Link</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // ===== Inject sebelum .back-btn-wrap, atau sebelum footer =====
  function inject(){
    const target = document.querySelector('.back-btn-wrap') || document.querySelector('footer');
    if (!target) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    target.parentNode.insertBefore(tmp.firstElementChild, target);

    // Handler Copy Link
    const copyBtn = document.querySelector('.share-copy[data-share="copy"]');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(pageUrl);
          copyBtn.classList.add('copied');
          copyBtn.querySelector('.lbl').textContent = 'Tersalin!';
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.querySelector('.lbl').textContent = 'Salin Link';
          }, 2000);
        } catch (e) {
          // Fallback untuk browser lama
          const ta = document.createElement('textarea');
          ta.value = pageUrl;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          copyBtn.querySelector('.lbl').textContent = 'Tersalin!';
          setTimeout(() => copyBtn.querySelector('.lbl').textContent = 'Salin Link', 2000);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
