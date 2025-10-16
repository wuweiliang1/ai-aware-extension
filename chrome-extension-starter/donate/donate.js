// Donate page with i18n support

// Apply translations to page
function applyTranslations() {
  // Translate elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = window.i18n.t(key);
  });
}

// Wait for i18n to be ready
(async function() {
  await window.i18n.init();
  applyTranslations();
  
  // Detect user region (China or International)
  function detectRegion() {
    const locale = window.i18n.currentLocale;
    return locale === 'zh-CN' ? 'china' : 'international';
  }

  // Payment configuration
  const paymentConfig = {
    paypalLink: 'https://paypal.me/youraccount', // Replace with your actual PayPal.me link
    wechatQR: '../icons/icon128.png' // Replace with your actual WeChat QR code image
  };

  const region = detectRegion();
  
  // Show appropriate payment section
  if (region === 'china') {
    document.getElementById('chinaSection').style.display = 'block';
    document.getElementById('internationalSection').style.display = 'none';
    document.getElementById('wechatQR').src = paymentConfig.wechatQR;
    document.getElementById('paypalLinkChina').href = paymentConfig.paypalLink;
  } else {
    document.getElementById('chinaSection').style.display = 'none';
    document.getElementById('internationalSection').style.display = 'block';
    document.getElementById('wechatQRIntl').src = paymentConfig.wechatQR;
    document.getElementById('paypalLinkIntl').href = paymentConfig.paypalLink;
  }

  // Back link handler
  document.getElementById('backLink').addEventListener('click', (e) => {
    e.preventDefault();
    window.close();
  });
})();
