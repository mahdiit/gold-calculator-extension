function formatNumber(num) {
    return num.toLocaleString("fa-IR");
}

// نرمال‌سازی ارقام فارسی/عربی به ارقام لاتین
function normalizePersianDigits(s) {
    if (!s) return "";
    s = s.toString();
    // ارقام فارسی ۰-۹ (U+06F0 - U+06F9)
    s = s.replace(/[\u06F0-\u06F9]/g, function (c) {
        return String(c.charCodeAt(0) - 0x06F0);
    });
    // ارقام عربی-هندی ٠-٩ (U+0660 - U+0669)
    s = s.replace(/[\u0660-\u0669]/g, function (c) {
        return String(c.charCodeAt(0) - 0x0660);
    });
    return s;
}

function extractNumber(text) {
    if (!text && text !== 0) return NaN;
    let s = normalizePersianDigits(text);

    // حذف جداکننده‌های هزارگان و علائم فاصله (٬ , فاصله‌های مختلف، ویرگول عربی/فارسی)
    s = s.replace(/[\s\u00A0\u200C,\u060C\u066C]/g, "");

    // حالا اولین توالیِ ارقام را بردار و به عدد تبدیل کن
    let m = s.match(/\d+/);
    return m ? parseInt(m[0], 10) : NaN;
}

// استخراج عدد اعشاری (مناسب برای وزن مثل ۰٫۳ یا 0.3)
function extractFloat(text) {
    if (!text && text !== 0) return NaN;
    let s = normalizePersianDigits(text);

    // تبدیل جداکننده اعشاری عربی '٫' (U+066B) به نقطه
    s = s.replace(/\u066B/g, ".");

    // حذف جداکننده‌های هزارگان (اما نقطه اعشاری را نگه می‌داریم)
    s = s.replace(/[\s\u00A0\u200C,\u060C\u066C]/g, "");

    // پیدا کردن اولین الگوی عددی ممکن (با یا بدون اعشار)
    let m = s.match(/\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : NaN;
}

window.__GOLD_SITE_CONFIGS__ = window.__GOLD_SITE_CONFIGS__ || {
    "gold.khanoumi.com": {
        productPrice: ".price-with-toman span",
        weight: ".c-select-btn span.filled",
        goldPrice: 'span[style="font-weight: 600; color: rgb(219, 39, 119);"]',
    },
    "digizargar.com": {
        goldPrice: "div[class='header-center-current-price d-flex'] p",
        weight: "span[class='vs__selected']",
        productPrice: "div[class='price-box'] div"
    }
};

(function () {


    const siteConfigs = window.__GOLD_SITE_CONFIGS__;
    let hostname = window.location.hostname.replace("www.", "");

    console.info(hostname);

    let config = siteConfigs[hostname];
    if (!config) {
        alert("این سایت پشتیبانی نمی‌شود: " + hostname);
        return;
    }

    // حذف قبلی
    let oldBox = document.querySelector("#gold-info-box");
    if (oldBox) oldBox.remove();

    // قیمت کالا
    let productPriceEl = document.querySelector(config.productPrice);
    if (!productPriceEl) {
        console.error("no product found");
        return;
    }

    let productPrice = extractNumber(productPriceEl.innerText);

    // وزن کالا
    let weightEl = document.querySelector(config.weight);
    if (!weightEl) {
        console.error("no weight found");
        return;
    }

    let weight = extractFloat(weightEl.innerText);

    // قیمت هر گرم طلا
    let goldPriceEl = document.querySelector(config.goldPrice);
    if (!goldPriceEl) {
        console.error("no gold price found");
        return;
    }
    let goldPrice = extractNumber(goldPriceEl.innerText);

    // محاسبات
    let goldValue = goldPrice * weight;
    let diff = productPrice - goldValue;
    let percent = ((diff / goldValue) * 100).toFixed(2);

    console.table({ goldValue, diff, percent });

    let perGramPrice = Math.round(productPrice / weight);

    // ایجاد المان نمایش
    let infoBox = document.createElement("div");
    infoBox.style.marginTop = "10px";
    infoBox.style.padding = "8px";
    infoBox.style.border = "1px solid #ccc";
    infoBox.style.borderRadius = "8px";
    infoBox.style.background = "#f9f9f9";
    infoBox.style.fontFamily = "tahoma";
    infoBox.style.fontSize = "14px";
    infoBox.id = "gold-info-box";

    infoBox.innerHTML = `
    <b>تحلیل قیمت:</b><br>
    🔹 درصد بالاتر از طلای خام: ${percent}%<br>
    🔹 قیمت هر گرم با احتساب اجرت: ${formatNumber(perGramPrice)} تومان
  `;

    // اضافه کردن درست زیر قیمت کالا
    productPriceEl.parentNode.appendChild(infoBox);
})();