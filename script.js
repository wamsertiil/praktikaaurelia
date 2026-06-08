const roomData = {
    standard: { title_key: "r1_title", price: 1800, img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800", desc_key: "r1_desc" },
    std_mod: { title_key: "r2_title", price: 1950, img: "https://content.skyscnr.com/available/2643285170/2643285170_768x576.jpg", desc_key: "r2_desc" },
    std_cozy: { title_key: "r3_title", price: 2100, img: "https://content.skyscnr.com/available/2441888996/2441888996_1024x576.jpg", desc_key: "r3_desc" },
    family: { title_key: "r4_title", price: 3800, img: "https://ribas.hotels-odessa-ua.com/data/Pictures/OriginalPhoto/6819/681980/681980316/odesa-noname-hotel-odessa-picture-77.JPEG", desc_key: "r4_desc" },
    junior: { title_key: "r5_title", price: 3200, img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800", desc_key: "r5_desc" },
    jun_prem: { title_key: "r6_title", price: 3500, img: "https://media-cdn.tripadvisor.com/media/photo-s/21/8f/42/c4/andersen-presidential.jpg", desc_key: "r6_desc" },
    luxury: { title_key: "r7_title", price: 5500, img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800", desc_key: "r7_desc" },
    lux_royal: { title_key: "r8_title", price: 6200, img: "https://bratislava.ua/media/uploadimage/3d00561de6a44551b7789731cebb5520.jpg", desc_key: "r8_desc" },
    lux_pano: { title_key: "r9_title", price: 6800, img: "https://poshuk2.xotravel.dev/assets/ec10d1ed-3ba1-42e6-8b5d-10b247011eb0?key=article-item-main-image", desc_key: "r9_desc" },
    presidential: { title_key: "r10_title", price: 8500, img: "https://7sky.kiev.ua/wp-content/uploads/2017/01/IMG_20241.jpg", desc_key: "r10_desc" }
};

const offersData = {
    early: { title_key: "off_early_title", img: "https://st.depositphotos.com/1001001/4043/i/450/depositphotos_40438175-stock-photo-mother-and-daughter-at-beach.jpg", glow: "gold", desc_key: "off_early_full" },
    romance: { title_key: "off_romance_title", img: "https://donum.ua/image/catalog/Kategorii-Foto/Romantica/new/uikend-new.jpg", glow: "pink", desc_key: "off_romance_full" }
};

const validPromoCodes = { 'summer2026': 0.10, 'odessa2026': 0.15, 'promo': 0.20 };
let currentDiscount = 0;
let bookingInfo = { total: 0, nights: 1, roomName: "", checkin: "", checkout: "" };

const heroImages = [
    "url('https://kirillovka.ks.ua/wp-content/uploads/2018/11/odessa-13-aleksey-chumak.jpg')",
    "url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1600')",
    "url('https://panoramadeluxe.com/userfiles/image/gallery/restouran11.jpg')"
];
let currentImage = 0;
const heroSection = document.getElementById('hero');
if(heroSection) {
    setInterval(() => {
        currentImage = (currentImage + 1) % heroImages.length;
        heroSection.style.backgroundImage = heroImages[currentImage];
    }, 5000);
}

const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const adultsInput = document.getElementById('adults');
const childrenInput = document.getElementById('children');

const todayStr = new Date().toISOString().split('T')[0];
if(checkinInput && checkoutInput) {
    checkinInput.min = todayStr;
    checkinInput.addEventListener('change', () => {
        checkoutInput.min = checkinInput.value;
        if(checkoutInput.value && checkoutInput.value < checkinInput.value) checkoutInput.value = checkinInput.value;
    });
}

function showPromoNotification(discountPercent) {
    const lang = localStorage.getItem('hotelLang') || 'uk';
    const msg = lang === 'uk' 
        ? `Промокод активовано! Знижку ${discountPercent}% застосовано до всіх номерів.`
        : `Promo code activated! ${discountPercent}% discount applied to all rooms.`;
    
    let popup = document.querySelector('.promo-success-popup');
    if(!popup) {
        popup = document.createElement('div');
        popup.className = 'promo-success-popup';
        popup.innerHTML = `<div class="promo-popup-content"><i class="fas fa-percentage"></i> <span id="promo-popup-text"></span></div>`;
        document.body.appendChild(popup);
    }
    document.getElementById('promo-popup-text').innerText = msg;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 4500);
}

const calcBtn = document.getElementById('calc-btn');
if(calcBtn) {
    calcBtn.onclick = () => {
        const lang = localStorage.getItem('hotelLang') || 'uk';
        if(!checkinInput.value || !checkoutInput.value) {
            alert(lang === 'uk' ? "Будь ласка, оберіть дати заїзду та виїзду." : "Please select check-in and check-out dates.");
            return;
        }
        
        const promoVal = document.getElementById('promocode').value.trim().toLowerCase();
        
        if(promoVal && validPromoCodes[promoVal]) {
            currentDiscount = validPromoCodes[promoVal];
            showPromoNotification(currentDiscount * 100);
        } else if (promoVal) {
            alert(lang === 'uk' ? 'Невірний або прострочений промокод.' : 'Invalid or expired promo code.');
            currentDiscount = 0;
        } else {
            currentDiscount = 0;
        }

        document.querySelectorAll('.room-card').forEach(card => {
            let ribbon = card.querySelector('.discount-ribbon');
            const basePrice = parseInt(card.dataset.price);
            const priceElement = card.querySelector('.price');

            if(currentDiscount > 0) {
                if(!ribbon) {
                    ribbon = document.createElement('div');
                    ribbon.className = 'discount-ribbon';
                    card.querySelector('.room-img').appendChild(ribbon);
                }
                ribbon.innerText = `-${currentDiscount * 100}%`;
                const discountedPrice = basePrice - (basePrice * currentDiscount);
                priceElement.innerHTML = `
                    <span data-i18n="price_from">${translations[lang].price_from}</span> 
                    <span style="text-decoration: line-through; font-size: 14px; color: #999; margin: 0 5px;">${basePrice.toLocaleString()}</span>
                    <span class="val" style="color: #e74c3c; margin-right: 5px;">${discountedPrice.toLocaleString()} ₴</span> 
                    <span>/ <span data-i18n="price_night">${translations[lang].price_night}</span></span>
                `;
            } else {
                if (ribbon) ribbon.remove();
                priceElement.innerHTML = `
                    <span data-i18n="price_from">${translations[lang].price_from}</span> 
                    <span class="val" style="margin: 0 5px;">${basePrice.toLocaleString()} ₴</span> 
                    <span>/ <span data-i18n="price_night">${translations[lang].price_night}</span></span>
                `;
            }
        });
        changeLanguage(lang);
        document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' });
    };
}

const sortSelect = document.getElementById('sort-rooms');
const roomsTrack = document.getElementById('rooms-track');
if(sortSelect && roomsTrack) {
    sortSelect.addEventListener('change', function() {
        let cards = Array.from(roomsTrack.getElementsByClassName('room-card'));
        let sortValue = this.value;
        if(sortValue === 'price-asc') cards.sort((a, b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
        else if(sortValue === 'price-desc') cards.sort((a, b) => parseInt(b.dataset.price) - parseInt(a.dataset.price));
        else {
            const defaultOrder = { 'standard': 1, 'std_mod': 2, 'std_cozy': 3, 'family': 4, 'junior': 5, 'jun_prem': 6, 'luxury': 7, 'lux_royal': 8, 'lux_pano': 9, 'presidential': 10 };
            cards.sort((a, b) => defaultOrder[a.dataset.room] - defaultOrder[b.dataset.room]);
        }
        roomsTrack.innerHTML = '';
        cards.forEach(card => roomsTrack.appendChild(card));
    });
}

const setupCarousel = (trackId, prevId, nextId) => {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if(track && prevBtn && nextBtn) {
        nextBtn.onclick = () => { const card = track.children[0]; track.scrollBy({ left: card.offsetWidth + 30, behavior: 'smooth' }); };
        prevBtn.onclick = () => { const card = track.children[0]; track.scrollBy({ left: -(card.offsetWidth + 30), behavior: 'smooth' }); };
    }
};
setupCarousel('rooms-track', 'room-prev', 'room-next');
setupCarousel('reviews-track', 'rev-prev', 'rev-next');

document.querySelectorAll('.room-card').forEach(card => {
    const room = roomData[card.dataset.room];

    card.querySelector('.room-img').onclick = () => {
        const lang = localStorage.getItem('hotelLang') || 'uk';
        const title = translations[lang][room.title_key];
        const desc = translations[lang][room.desc_key];
        
        document.getElementById('modal-info-content').innerHTML = `
            <img src="${room.img}" style="width:100%; border-radius:10px; margin-bottom: 15px;">
            <h2 style="margin-top:10px; color: #333;">${title}</h2>
            <p style="margin: 15px 0; color: #555; line-height: 1.6;">${desc}</p>
            <h3 style="color: #c5a059; margin-top: 20px;"><span data-i18n="price_word">${translations[lang].price_word}</span>: ${room.price.toLocaleString()} ₴ / <span data-i18n="price_night">${translations[lang].price_night}</span></h3>
        `;
        document.getElementById('modal-info').style.display = 'flex';
    };

    card.querySelector('.book-room-btn').onclick = (e) => {
        e.stopPropagation();
        const lang = localStorage.getItem('hotelLang') || 'uk';
        
        let checkinDate, checkoutDate;
        if (checkinInput && checkinInput.value) checkinDate = new Date(checkinInput.value);
        else checkinDate = new Date();
        checkinDate.setHours(0,0,0,0);

        if (checkoutInput && checkoutInput.value) checkoutDate = new Date(checkoutInput.value);
        else { checkoutDate = new Date(checkinDate); checkoutDate.setDate(checkoutDate.getDate() + 1); }
        checkoutDate.setHours(0,0,0,0);
        
        if (checkoutDate <= checkinDate) return alert(lang==='uk'?"Дата виїзду має бути пізніше дати заїзду!":"Check-out date must be later than check-in!");

        let nights = Math.round((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
        if (nights <= 0) nights = 1;

        const baseTotal = nights * room.price;
        const discountAmount = baseTotal * currentDiscount;
        const finalTotal = baseTotal - discountAmount;
        const title = translations[lang][room.title_key];

        bookingInfo = { total: finalTotal, nights, roomName: title };

        let summaryHTML = `
            <div class="booking-summary-box">
                <p style="margin-bottom: 15px; font-size: 16px;"><strong><span data-i18n="sum_room">${translations[lang].sum_room}</span>:</strong> ${title}</p>
                <div class="b-summary-row">
                    <span><span data-i18n="sum_dates">${translations[lang].sum_dates}</span>:</span> <span>${checkinDate.toLocaleDateString('uk-UA')} — ${checkoutDate.toLocaleDateString('uk-UA')}</span>
                </div>
                <div class="b-summary-row">
                    <span><span data-i18n="sum_price_night">${translations[lang].sum_price_night}</span>:</span> <span>${room.price.toLocaleString()} ₴</span>
                </div>
                <div class="b-summary-row">
                    <span><span data-i18n="sum_nights">${translations[lang].sum_nights}</span>:</span> <span>${nights}</span>
                </div>
        `;

        if (currentDiscount > 0) {
            summaryHTML += `
                <div class="b-summary-row" style="margin-top: 10px;">
                    <span><span data-i18n="sum_base">${translations[lang].sum_base}</span>:</span> <span>${baseTotal.toLocaleString()} ₴</span>
                </div>
                <div class="b-summary-row" style="color: #e74c3c; font-weight: bold;">
                    <span><span data-i18n="sum_discount">${translations[lang].sum_discount}</span> (${currentDiscount*100}%):</span> <span>-${discountAmount.toLocaleString()} ₴</span>
                </div>
                <div class="b-summary-total">
                    <span><span data-i18n="sum_total">${translations[lang].sum_total}</span>:</span> <span style="color: #e74c3c;">${finalTotal.toLocaleString()} ₴</span>
                </div>
            `;
        } else {
            summaryHTML += `
                <div class="b-summary-total">
                    <span><span data-i18n="sum_total">${translations[lang].sum_total}</span>:</span> <span style="color: #c5a059;">${baseTotal.toLocaleString()} ₴</span>
                </div>
            `;
        }
        summaryHTML += `</div>`;

        document.getElementById('booking-summary').innerHTML = summaryHTML;
        document.getElementById('modal-booking').style.display = 'flex';
    };
});

document.querySelectorAll('.offer-btn').forEach(btn => {
    btn.onclick = () => {
        const lang = localStorage.getItem('hotelLang') || 'uk';
        const offer = offersData[btn.dataset.offer];
        const shadowColor = offer.glow === 'pink' ? 'rgba(255, 105, 180, 0.6)' : 'rgba(197, 160, 89, 0.6)';
        const borderColor = offer.glow === 'pink' ? '#ff69b4' : '#c5a059';

        document.getElementById('modal-info-content').innerHTML = `
            <div style="text-align: center;">
                <div style="position:relative; margin-bottom: 25px; border-radius:12px; box-shadow: 0 10px 40px ${shadowColor}; border: 2px solid ${borderColor}; overflow: hidden;">
                    <img src="${offer.img}" alt="Акція" style="width: 100%; display: block;">
                </div>
                <h2 style="margin-bottom: 20px; color: #111; font-size: 24px; text-transform: uppercase;" data-i18n="${offer.title_key}">${translations[lang][offer.title_key]}</h2>
                <p style="color: #555; line-height: 1.8; font-size: 15px; text-align: left; margin-bottom: 30px;" data-i18n="${offer.desc_key}">${translations[lang][offer.desc_key]}</p>
                <button class="btn-main btn-full" onclick="openOfferBooking('${offer.title_key}')" style="font-size: 16px;" data-i18n="btn_book_offer">${translations[lang].btn_book_offer}</button>
            </div>
        `;
        document.getElementById('modal-info').style.display = 'flex';
    };
});

window.openOfferBooking = function(titleKey) {
    document.getElementById('modal-info').style.display = 'none';
    const lang = localStorage.getItem('hotelLang') || 'uk';

    let checkinDate = checkinInput && checkinInput.value ? new Date(checkinInput.value) : new Date();
    let checkoutDate = checkoutInput && checkoutInput.value ? new Date(checkoutInput.value) : new Date(new Date().setDate(new Date().getDate() + 1));
    checkinDate.setHours(0,0,0,0); checkoutDate.setHours(0,0,0,0);
    if (checkoutDate <= checkinDate) { checkoutDate = new Date(checkinDate); checkoutDate.setDate(checkoutDate.getDate() + 1); }

    let nights = Math.round((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
    if (nights <= 0) nights = 1;
    
    const adults = adultsInput ? adultsInput.value : 2;
    const children = childrenInput ? childrenInput.value : 0;
    const offerName = translations[lang][titleKey] || "Акція";

    document.getElementById('booking-summary').innerHTML = `
        <div class="booking-summary-box">
            <p style="margin-bottom: 8px;"><strong><span data-i18n="offer_summary_type">${translations[lang].offer_summary_type}</span>:</strong> ${offerName}</p>
            <p style="margin-bottom: 8px;"><strong><span data-i18n="sum_dates">${translations[lang].sum_dates}</span>:</strong> ${checkinDate.toLocaleDateString('uk-UA')} — ${checkoutDate.toLocaleDateString('uk-UA')} (${nights})</p>
            <p style="margin-bottom: 8px;"><strong><span data-i18n="sum_guests">${translations[lang].sum_guests}</span>:</strong> <span data-i18n="sum_adults">${translations[lang].sum_adults}</span>: ${adults}, <span data-i18n="sum_children">${translations[lang].sum_children}</span>: ${children}</p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 10px 0;">
            <p style="font-size: 1rem; color: #555;" data-i18n="offer_summary_manager">${translations[lang].offer_summary_manager}</p>
        </div>
    `;
    document.getElementById('modal-booking').style.display = 'flex';
};

const modalLightbox = document.getElementById('modal-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
document.querySelectorAll('.gallery-img-wrap img').forEach(img => {
    img.onclick = () => { lightboxImg.src = img.src; if(modalLightbox) modalLightbox.style.display = 'flex'; };
});

const burgerBtn = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuBtn = document.getElementById('close-menu-btn');
if(burgerBtn && mobileMenu) {
    burgerBtn.onclick = () => { mobileMenu.style.display = 'flex'; setTimeout(()=> mobileMenu.classList.add('active'), 10); };
    const closeMenu = () => { mobileMenu.classList.remove('active'); setTimeout(() => mobileMenu.style.display = 'none', 300); };
    closeMenuBtn.onclick = closeMenu;
    document.querySelectorAll('.mobile-nav-links a').forEach(a => a.onclick = closeMenu);
}

const modalAuth = document.getElementById('modal-auth');
const btnLogin = document.getElementById('btn-login');
const mobileLogin = document.getElementById('mobile-login');
if(btnLogin) btnLogin.onclick = () => modalAuth.style.display = 'flex';
if(mobileLogin) mobileLogin.onclick = (e) => { e.preventDefault(); modalAuth.style.display = 'flex'; document.getElementById('mobile-menu').classList.remove('active'); setTimeout(() => document.getElementById('mobile-menu').style.display = 'none', 300); };

const authForm = document.getElementById('auth-form');
if(authForm) {
    authForm.onsubmit = (e) => { 
        e.preventDefault(); 
        const lang = localStorage.getItem('hotelLang') || 'uk';
        alert(lang === 'uk' ? "Ви успішно авторизувались!" : "You have successfully logged in!"); 
        modalAuth.style.display = 'none'; 
        authForm.reset(); 
    };
}

const contactForm = document.getElementById('contact-form');
if(contactForm) {
    contactForm.onsubmit = (e) => {
        e.preventDefault();
        const lang = localStorage.getItem('hotelLang') || 'uk';
        const msg = lang === 'uk' 
            ? `Дякуємо, ${document.getElementById('u-name').value}!\nВаше бронювання успішно створено.\nМи зателефонуємо на ${document.getElementById('u-phone').value}.`
            : `Thank you, ${document.getElementById('u-name').value}!\nYour booking was successfully created.\nWe will call you at ${document.getElementById('u-phone').value}.`;
        alert(msg);
        document.getElementById('modal-booking').style.display = 'none';
        contactForm.reset();
        document.getElementById('u-phone').value = "+380";
    };
}

const feedbackForm = document.getElementById('feedback-form');
if(feedbackForm) {
    feedbackForm.onsubmit = (e) => {
        e.preventDefault();
        const lang = localStorage.getItem('hotelLang') || 'uk';
        const msg = lang === 'uk'
            ? "Дякуємо! Ваш запит надіслано. Ми скоро зв'яжемося з вами."
            : "Thank you! Your request has been sent. We will contact you shortly.";
        alert(msg);
        feedbackForm.reset();
        document.getElementById('f-phone').value = "+380";
    };
}

document.querySelectorAll('input[type="tel"]').forEach(phoneInput => {
    phoneInput.oninput = function() {
        let val = this.value.replace(/[^\d+]/g, ''); 
        if (!val.startsWith('+380')) val = '+380' + val.replace(/^\+?3?8?0?/, '');
        this.value = val.substring(0, 13);
    };
});

const emailInput = document.getElementById('u-email');
if(emailInput) {
    emailInput.onblur = function() {
        let val = this.value.trim();
        if(val.length > 0 && !val.includes('@')) this.value = val + '@gmail.com';
    };
}

const modals = [ { btn: 'close-info', modal: 'modal-info' }, { btn: 'close-booking', modal: 'modal-booking' }, { btn: 'close-lightbox', modal: 'modal-lightbox' }, { btn: 'close-auth', modal: 'modal-auth' } ];
modals.forEach(m => { const btn = document.getElementById(m.btn); if(btn) btn.onclick = () => document.getElementById(m.modal).style.display = 'none'; });
window.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) e.target.style.display = 'none'; });

// --- ПЕРЕКЛАДИ ---
const translations = {
    uk: {
        nav_about: "Про готель", nav_rooms: "Номери", nav_services: "Послуги", nav_offers: "Акції", nav_gallery: "Галерея", nav_reviews: "Відгуки", nav_contacts: "Контакти", nav_login: "Увійти",
        hero_title: "Берег моря. Затишок. AURELIA.", hero_subtitle: "Ваш ідеальний відпочинок у самому серці Одеси",
        book_checkin: "Заїзд", book_checkout: "Виїзд", book_adults: "Дорослі", book_children: "Діти", book_promo: "Промокод", book_btn: "Знайти номери",
        about_title: "Ласкаво просимо до Aurelia", btn_read_more: "Читати детальніше",
        about_p1: "Готель Aurelia — це поєднання сучасної розкоші та традиційної одеської гостинності. Наш готель пропонує неперевершений вид на Чорне море та сервіс преміум-класу.",
        about_p2: "Ми подбали про кожну деталь, щоб ваш відпочинок, ділова поїздка або сімейний вікенд пройшли ідеально.",
        feat_1: "Перша лінія", feat_2: "Безкоштовний паркінг", feat_3: "Pet-friendly", badge_pop: "Популярний", badge_family: "Для сім'ї",
        filter_sort: "Сортування:", filter_default: "За популярністю", filter_cheap: "Від дешевих до дорогих", filter_exp: "Від дорогих до дешевих",
        r1_title: "Standard Classic", r1_desc: "Комфортний номер для двох з видом на місто або внутрішній двір.",
        r2_title: "Standard Modern", r2_desc: "Світлий номер у сучасному стилі з оновленим дизайном.",
        r3_title: "Standard Cozy", r3_desc: "Просторий стандарт з покращеним плануванням та кавомашиною.",
        r4_title: "Family Room", r4_desc: "Ідеальний варіант для сімейного відпочинку. Дві кімнати та дитячий куточок.",
        r5_title: "Junior Suite Sea View", r5_desc: "Просторий номер з власною терасою та панорамним видом на море.",
        r6_title: "Junior Suite Premium", r6_desc: "Напівлюкс преміум-класу з окремою зоною для відпочинку.",
        r7_title: "Luxury Aurelia & Spa", r7_desc: "Преміум апартаменти з власною зоною відпочинку та джакузі.",
        r8_title: "Luxury Royal", r8_desc: "Ексклюзивний дизайн, простора вітальня та дві ванні кімнати для максимального комфорту.",
        r9_title: "Luxury Panoramic", r9_desc: "Люкс на верхньому поверсі з панорамними вікнами та власним міні-баром.",
        r10_title: "Presidential Suite", r10_desc: "Найрозкішніший номер готелю. Власний кабінет, тераса та персональний консьєрж.",
        price_from: "Від", price_night: "ніч", price_word: "Ціна", btn_details: "Детальніше", btn_book_now: "Забронювати",
        sum_room: "Номер", sum_dates: "Дати", sum_price_night: "Ціна за 1 ніч", sum_nights: "Кількість ночей", sum_base: "Базова вартість", sum_discount: "Знижка", sum_total: "До сплати", sum_guests: "Гості", sum_adults: "Дорослих", sum_children: "Дітей",
        srv_rest_title: "Ресторан 'Хвиля'", srv_rest_desc: "Сніданки 'шведський стіл' та авторська морська кухня від шеф-кухаря.",
        srv_pool_title: "Басейн & СПА", srv_pool_desc: "Великий басейн з підігрівом, сауна та масажний кабінет.",
        srv_beach_title: "Приватний Пляж", srv_beach_desc: "Власна закрита зона на березі моря з шезлонгами та рушниками.",
        srv_bar_title: "Lounge Бар", srv_bar_desc: "Вишукані коктейлі, жива музика та прохолодні напої 24/7.",
        off_early_title: "Раннє бронювання", off_early_desc: "Забронюйте номер за 30 днів до заїзду та отримайте знижку 15%.",
        off_early_full: "Плануйте свій ідеальний відпочинок заздалегідь та економте! При бронюванні за 30 днів до дати заїзду ви отримуєте гарантовану знижку 15% на всі категорії номерів.<br><br><strong>Додаткова інформація:</strong> Ця пропозиція ідеально підходить для сімейного відпочинку. У вартість також включено сніданки та безлімітний доступ до басейну.<br><br><strong>Умови бронювання:</strong> Необхідна 100% передоплата. Безкоштовне скасування можливе не пізніше ніж за 14 днів до заїзду.",
        off_romance_title: "Романтичний вікенд", off_romance_desc: "Шампанське, фрукти в номер та пізній виїзд у подарунок для закоханих.", 
        off_romance_full: "Зробіть незабутній сюрприз коханій людині! Спеціальний пакет для пар, що шукають усамітнення та романтики.<br><br><strong>Пакет включає:</strong><br>• Проживання в номері обраної категорії.<br>• Пляшка преміального ігристого вина та свіжі фрукти при заїзді.<br>• Сніданок у ліжко (за бажанням).<br>• Безлімітне відвідування SPA-зони на двох.<br>• Пізній виїзд до 16:00.<br><br><strong>Умови:</strong> Бронювання мінімум за 3 дні до заїзду.",
        btn_more: "Дізнатися більше", btn_book_offer: "Забронювати за акцією", offer_summary_type: "Бронювання за акцією", offer_summary_manager: "Остаточну вартість зі знижкою повідомить менеджер.",
        rev_1: "Чудовий готель! Неймовірний вид на море, дуже смачні сніданки. Обов'язково повернемося ще раз.", rev_2: "Святкували тут річницю. Шампанське в номер, ідеальна чистота та привітний персонал. SPA зона просто супер.", rev_3: "Гарне місце для відпочинку на вихідних. Зручна парковка, смачна кухня в ресторані. Трохи повільний Wi-Fi біля басейну.",
        rev_4: "Відмінне розташування, поруч багато ресторанів. Номер дуже чистий і просторий. Рекомендую!", rev_5: "Найкращий сервіс, який я коли-небудь бачила. Персонал вирішив усі наші запити. Обов'язково приїдемо влітку.", rev_6: "Смачна кава, гарний вид. Трохи шумно ввечері через музику з бару, але загалом враження дуже позитивні.",
        feed_title: "Маєте запитання?", feed_desc: "Заповніть форму, і наш менеджер зв'яжеться з вами найближчим часом для консультації.", form_name: "Ваше ім'я", feed_msg: "Ваше повідомлення...", feed_btn: "Відправити",
        foot_desc: "Ваш преміальний відпочинок на березі Чорного моря.", foot_links: "Корисні посилання", foot_rules: "Правила проживання", foot_privacy: "Політика конфіденційності", foot_transfer: "Трансфер",
        modal_book_title: "Оформлення бронювання", modal_book_sub: "Заповніть дані для підтвердження",
        form_surname: "Прізвище", form_phone: "Телефон", form_notes: "Особливі побажання (необов'язково)", form_notes_placeholder: "Наприклад: дитяче ліжечко, тихий номер, високий поверх...", form_agree: "Я погоджуюсь з правилами проживання", form_submit: "Підтвердити бронювання",
        auth_title: "Авторизація", auth_pass: "Пароль",
        info_home: "На головну", info_back: "Повернутися до готелю",
        rules_h2: "Правила проживання", rules_h3_1: "1. Час заїзду та виїзду",
        rules_li_1_1: "<strong>Час заїзду (Check-in):</strong> з 14:00.", rules_li_1_2: "<strong>Час виїзду (Check-out):</strong> до 12:00.", rules_li_1_3: "Ранній заїзд та пізній виїзд надаються за наявності вільних номерів та оплачуються додатково.",
        rules_h3_2: "2. Проживання з дітьми", rules_li_2_1: "Діти до 6 років розміщуються безкоштовно без надання додаткового місця.", rules_li_2_2: "За запитом безкоштовно надається дитяче ліжечко-манеж.",
        rules_h3_3: "3. Розміщення з тваринами (Pet-friendly)", rules_li_3_1: "Готель приймає гостей з собаками вагою до 5 кг.", rules_li_3_2: "Вартість розміщення улюбленця — 500 ₴ / доба.",
        rules_h3_4: "4. Загальні правила", rules_li_4_1: "У номерах та на балконах суворо заборонено палити (штраф 2000 ₴).", rules_li_4_2: "Режим тиші діє з 23:00 до 07:00.",
        priv_h2: "Політика конфіденційності", priv_p1: "Готель Aurelia серйозно ставиться до безпеки персональних даних наших гостей. Збір та обробка інформації здійснюється відповідно до законодавства.",
        priv_h3_1: "Які дані ми збираємо:", priv_li_1_1: "Ім'я, прізвище та контактний номер телефону.", priv_li_1_2: "Адреса електронної пошти для відправки підтвердження бронювання.", priv_li_1_3: "Дати перебування та особливі побажання.",
        priv_h3_2: "Як ми використовуємо ваші дані:", priv_li_2_1: "Для оформлення бронювання та надання готельних послуг.", priv_li_2_2: "Для зв'язку з вами у разі змін у вашому бронюванні.", priv_li_2_3: "Ваші дані <strong>ніколи</strong> не передаються третім особам у маркетингових цілях.",
        trans_h2: "Послуги Трансферу", trans_p1: "Ми дбаємо про ваш комфорт ще до прибуття в готель. Готель Aurelia пропонує послуги преміального трансферу на автомобілях бізнес-класу.",
        trans_h3_1: "Напрямки та вартість:", trans_li_1_1: "<strong>Залізничний вокзал — Готель:</strong> 450 ₴. Час у дорозі ~15 хв.", trans_li_1_2: "<strong>Автовокзал — Готель:</strong> 550 ₴. Час у дорозі ~20 хв.", trans_li_1_3: "<strong>Міжміський трансфер:</strong> за індивідуальним прорахунком.",
        trans_h3_2: "Як замовити:", trans_p2: "Трансфер необхідно замовляти не пізніше ніж за 24 години до прибуття. Будь ласка, вкажіть це в полі \"Особливі побажання\" при бронюванні номера або зателефонуйте нашому консьєржу.",
        about_page_h2_1: "Історія Aurelia", about_page_p_1: "Готель Aurelia відчинив свої двері у 2022 році. З самого початку нашою метою було створити місце, де кожен гість зможе відчути справжню Одеську гостинність у поєднанні з найвищими європейскими стандартами сервісу.",
        about_page_h2_2: "Наша філософія", about_page_p_2: "Ми віримо, що ідеальний відпочинок складається з дрібниць. Саме тому ми приділяємо максимум уваги кожній деталі: від ідеально чистої білизни та авторського меню в ресторані до швидкого вирішення будь-яких запитів наших гостей.",
        about_page_h2_3: "Нагороди та досягнення", about_page_li_1: "Кращий морський готель Одеси 2024", about_page_li_2: "Відзнака Travellers' Choice 2025", about_page_li_3: "Еко-сертифікат Green Key за екологічні ініціативи"
    },
    en: {
        nav_about: "About Us", nav_rooms: "Rooms", nav_services: "Services", nav_offers: "Offers", nav_gallery: "Gallery", nav_reviews: "Reviews", nav_contacts: "Contacts", nav_login: "Log In",
        hero_title: "Seaside. Comfort. AURELIA.", hero_subtitle: "Your perfect getaway in the heart of Odessa",
        book_checkin: "Check-in", book_checkout: "Check-out", book_adults: "Adults", book_children: "Children", book_promo: "Promo Code", book_btn: "Find Rooms",
        about_title: "Welcome to Aurelia", btn_read_more: "Read More",
        about_p1: "Aurelia Hotel is a blend of modern luxury and traditional Odessa hospitality. Our hotel offers an unparalleled view of the Black Sea and premium service.",
        about_p2: "We have taken care of every detail so that your vacation, business trip or family weekend will be perfect.",
        feat_1: "First line", feat_2: "Free parking", feat_3: "Pet-friendly", badge_pop: "Popular", badge_family: "For Family",
        filter_sort: "Sort by:", filter_default: "Popularity", filter_cheap: "Price: Low to High", filter_exp: "Price: High to Low",
        r1_title: "Standard Classic", r1_desc: "Comfortable room for two with a view of the city or the courtyard.",
        r2_title: "Standard Modern", r2_desc: "Bright room in a modern style with an updated design.",
        r3_title: "Standard Cozy", r3_desc: "Spacious standard room with an improved layout and a coffee machine.",
        r4_title: "Family Room", r4_desc: "Ideal for family vacations. Two rooms and a children's play area.",
        r5_title: "Junior Suite Sea View", r5_desc: "Spacious room with a private terrace and panoramic sea views.",
        r6_title: "Junior Suite Premium", r6_desc: "Premium junior suite with a separate lounge area.",
        r7_title: "Luxury Aurelia & Spa", r7_desc: "Premium apartments with a private lounge area and jacuzzi.",
        r8_title: "Luxury Royal", r8_desc: "Exclusive design, spacious living room, and two bathrooms for maximum comfort.",
        r9_title: "Luxury Panoramic", r9_desc: "Top-floor suite with panoramic windows and a private mini-bar.",
        r10_title: "Presidential Suite", r10_desc: "The most luxurious room in the hotel. Private office, terrace, and personal concierge.",
        price_from: "From", price_night: "night", price_word: "Price", btn_details: "Details", btn_book_now: "Book Now",
        sum_room: "Room", sum_dates: "Dates", sum_price_night: "Price per 1 night", sum_nights: "Number of nights", sum_base: "Base cost", sum_discount: "Discount", sum_total: "Total to pay", sum_guests: "Guests", sum_adults: "Adults", sum_children: "Children",
        srv_rest_title: "Restaurant 'Wave'", srv_rest_desc: "Buffet breakfasts and signature seafood cuisine by the chef.",
        srv_pool_title: "Pool & SPA", srv_pool_desc: "Large heated pool, sauna, and massage room.",
        srv_beach_title: "Private Beach", srv_beach_desc: "Private enclosed area on the beach with sunbeds and towels.",
        srv_bar_title: "Lounge Bar", srv_bar_desc: "Exquisite cocktails, live music, and refreshing drinks 24/7.",
        off_early_title: "Early Booking", off_early_desc: "Book a room 30 days before arrival and get a 15% discount.",
        off_early_full: "Plan your perfect vacation in advance and save! When booking 30 days prior to arrival, you get a guaranteed 15% discount on all room categories.<br><br><strong>Additional info:</strong> This offer is perfect for family vacations. Breakfasts and unlimited pool access are included.<br><br><strong>Booking conditions:</strong> 100% prepayment required. Free cancellation is possible no later than 14 days before arrival.",
        off_romance_title: "Romantic Weekend", off_romance_desc: "Champagne, fruits in the room, and late check-out as a gift for lovers.", 
        off_romance_full: "Make an unforgettable surprise for your loved one! A special package for couples seeking privacy and romance.<br><br><strong>Package includes:</strong><br>• Accommodation in the selected room category.<br>• A bottle of premium sparkling wine and fresh fruit upon arrival.<br>• Breakfast in bed (optional).<br>• Unlimited access to the SPA area for two.<br>• Late check-out until 16:00.<br><br><strong>Conditions:</strong> Booking at least 3 days before arrival.",
        btn_more: "Learn More", btn_book_offer: "Book this offer", offer_summary_type: "Booking with offer", offer_summary_manager: "The final discounted price will be provided by the manager.",
        rev_1: "Great hotel! Incredible sea view, very tasty breakfasts. We will definitely return again.", rev_2: "Celebrated our anniversary here. Champagne in the room, perfect cleanliness and friendly staff. SPA area is just super.", rev_3: "A good place for a weekend getaway. Convenient parking, delicious food in the restaurant. Slightly slow Wi-Fi by the pool.",
        rev_4: "Excellent location, many restaurants nearby. The room is very clean and spacious. Highly recommend!", rev_5: "The best service I have ever seen. The staff resolved all our requests. We will definitely come in the summer.", rev_6: "Delicious coffee, beautiful view. A bit noisy in the evening due to the music from the bar, but overall very positive impressions.",
        feed_title: "Have a question?", feed_desc: "Fill out the form, and our manager will contact you shortly for a consultation.", form_name: "Your Name", feed_msg: "Your message...", feed_btn: "Send",
        foot_desc: "Your premium vacation on the shores of the Black Sea.", foot_links: "Useful Links", foot_rules: "Rules of accommodation", foot_privacy: "Privacy Policy", foot_transfer: "Transfer",
        modal_book_title: "Booking Checkout", modal_book_sub: "Fill in the details to confirm",
        form_surname: "Surname", form_phone: "Phone", form_notes: "Special requests (optional)", form_notes_placeholder: "Example: baby cot, quiet room, high floor...", form_agree: "I agree to the accommodation rules", form_submit: "Confirm Booking",
        auth_title: "Authorization", auth_pass: "Password",
        info_home: "Home", info_back: "Back to hotel",
        rules_h2: "Accommodation Rules", rules_h3_1: "1. Check-in and Check-out Time",
        rules_li_1_1: "<strong>Check-in time:</strong> from 14:00.", rules_li_1_2: "<strong>Check-out time:</strong> until 12:00.", rules_li_1_3: "Early check-in and late check-out are subject to availability and extra charge.",
        rules_h3_2: "2. Staying with children", rules_li_2_1: "Children under 6 years old stay free of charge using existing beds.", rules_li_2_2: "A baby cot is provided free of charge upon request.",
        rules_h3_3: "3. Pets (Pet-friendly)", rules_li_3_1: "The hotel accepts guests with dogs up to 5 kg.", rules_li_3_2: "The cost of pet accommodation is 500 ₴ / day.",
        rules_h3_4: "4. General rules", rules_li_4_1: "Smoking is strictly prohibited in rooms and on balconies (fine 2000 ₴).", rules_li_4_2: "Quiet hours are from 23:00 to 07:00.",
        priv_h2: "Privacy Policy", priv_p1: "Aurelia Hotel takes the security of our guests' personal data seriously. Information is collected and processed in accordance with the law.",
        priv_h3_1: "What data we collect:", priv_li_1_1: "Name, surname, and contact phone number.", priv_li_1_2: "Email address to send booking confirmation.", priv_li_1_3: "Dates of stay and special requests.",
        priv_h3_2: "How we use your data:", priv_li_2_1: "To process bookings and provide hotel services.", priv_li_2_2: "To contact you in case of changes to your booking.", priv_li_2_3: "Your data is <strong>never</strong> shared with third parties for marketing purposes.",
        trans_h2: "Transfer Services", trans_p1: "We take care of your comfort even before you arrive at the hotel. Aurelia Hotel offers premium transfer services in business-class cars.",
        trans_h3_1: "Directions and cost:", trans_li_1_1: "<strong>Railway station — Hotel:</strong> 450 ₴. Travel time ~15 min.", trans_li_1_2: "<strong>Bus station — Hotel:</strong> 550 ₴. Travel time ~20 min.", trans_li_1_3: "<strong>Intercity transfer:</strong> calculated individually.",
        trans_h3_2: "How to order:", trans_p2: "Transfers must be ordered no later than 24 hours before arrival. Please indicate this in the \"Special requests\" field when booking a room or call our concierge.",
        about_page_h2_1: "History of Aurelia", about_page_p_1: "Aurelia Hotel opened its doors in 2022. From the very beginning, our goal was to create a place where every guest could feel true Odessa hospitality combined with the highest European service standards.",
        about_page_h2_2: "Our Philosophy", about_page_p_2: "We believe that a perfect vacation consists of little things. That is why we pay maximum attention to every detail: from perfectly clean linen and a signature menu in the restaurant to the quick resolution of any guest requests.",
        about_page_h2_3: "Awards and Achievements", about_page_li_1: "Best seaside hotel in Odessa 2024", about_page_li_2: "Travellers' Choice Award 2025", about_page_li_3: "Green Key eco-certificate for environmental initiatives"
    }
};

const btnUk = document.getElementById('lang-uk');
const btnEn = document.getElementById('lang-en');

function changeLanguage(lang) {
    localStorage.setItem('hotelLang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (el.tagName.toLowerCase() === 'label' && el.querySelector('a')) {
                el.innerHTML = `Я погоджуюсь з <a href="info.html#rules" target="_blank">${lang === 'uk' ? 'правилами проживання' : 'the accommodation rules'}</a>`;
            } else {
                el.innerHTML = translations[lang][key]; 
            }
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) el.placeholder = translations[lang][key];
    });

    const notesTextarea = document.getElementById('u-notes');
    if (notesTextarea && translations[lang]['form_notes_placeholder']) {
        notesTextarea.placeholder = translations[lang]['form_notes_placeholder'];
    }

    if (btnUk && btnEn) {
        if (lang === 'en') { btnEn.classList.add('active'); btnUk.classList.remove('active'); }
        else { btnUk.classList.add('active'); btnEn.classList.remove('active'); }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('hotelLang') || 'uk';
    changeLanguage(savedLang);
});

if (btnUk && btnEn) {
    btnUk.onclick = () => changeLanguage('uk');
    btnEn.onclick = () => changeLanguage('en');
}