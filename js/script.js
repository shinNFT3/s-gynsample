document.addEventListener('DOMContentLoaded', () => {

  // Header Scroll Effect & Mobile Menu
  const header = document.querySelector('.header');
  const menuBtn = document.getElementById('menu-btn');
  const nav = document.getElementById('global-nav');

  // Hero Photo Slideshow (desktop: 5628→5629→5630, mobile: 5623→5627→5631)
  const heroEl = document.getElementById('hero-slideshow');
  if (heroEl) {
    const desktopSlides = Array.from(heroEl.querySelectorAll('.slide-desktop'));
    const mobileSlides  = Array.from(heroEl.querySelectorAll('.slide-mobile'));

    function initSlideshow() {
      const isMobile = window.innerWidth <= 768;
      // Show/hide correct group
      desktopSlides.forEach(s => { s.style.display = isMobile ? 'none' : ''; });
      mobileSlides.forEach(s  => { s.style.display = isMobile ? '' : 'none'; });
      const activeGroup = isMobile ? mobileSlides : desktopSlides;
      // Reset active class within the visible group
      activeGroup.forEach(s => s.classList.remove('active'));
      if (activeGroup.length > 0) activeGroup[0].classList.add('active');
    }

    initSlideshow();
    window.addEventListener('resize', initSlideshow);

    let current = 0;
    function nextSlide() {
      const isMobile = window.innerWidth <= 768;
      const slides = isMobile ? mobileSlides : desktopSlides;
      if (slides.length > 0) {
        slides[current % slides.length].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }
      setTimeout(nextSlide, isMobile ? 3000 : 6000);
    }
    setTimeout(nextSlide, window.innerWidth <= 768 ? 3000 : 6000);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('open');
      nav.classList.toggle('open');
      // Prevent body scroll when menu is open
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Instagram Dynamic Fetch or Mock Data
  const INSTAGRAM_ACCESS_TOKEN = 'YOUR_INSTAGRAM_ACCESS_TOKEN_HERE'; // ★ここに発行した長期アクセストークンを入力してください★
  const igGrid = document.getElementById('instagram-grid');

  if (igGrid) {
    if (INSTAGRAM_ACCESS_TOKEN === 'YOUR_INSTAGRAM_ACCESS_TOKEN_HERE') {
      // トークン未設定時のモックデータ（ダミー表示）
      const igData = [
        { id: 1, image: 'https://images.unsplash.com/photo-1596357395217-80de13130e92?q=80&w=800&auto=format&fit=crop', likes: 120, text: '本日の柔術クラスも多くの会員さんが汗を流しました！' },
        { id: 2, image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800&auto=format&fit=crop', likes: 85, text: 'No-Giクラスで実践的なグラップリング技術を丁寧に指導しています🔥' },
        { id: 3, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop', likes: 300, text: '新しい体験入会シーズンです。見学・体験お待ちしております！' },
        { id: 4, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop', likes: 112, text: '柔術初心者クラス。基本からサポートします！' },
        { id: 5, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop', likes: 210, text: '新しいマットスペース。広々使えます。' },
        { id: 6, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop', likes: 156, text: '体験入会はWEBから常時受付中。お待ちしています🥊' },
      ];
      igData.forEach(item => {
        const el = document.createElement('a');
        el.href = 'https://www.instagram.com/scorpion_gym?igsh=dnoycnhlNjdmdGN4';
        el.target = '_blank';
        el.className = 'ig-item';
        el.innerHTML = `
          <img src="${item.image}" alt="Instagram post" loading="lazy">
          <div class="ig-overlay">
            <div class="ig-likes"><i class="fa-solid fa-heart"></i> ${item.likes}</div>
            <div class="ig-text">${item.text}</div>
          </div>
        `;
        igGrid.appendChild(el);
      });
      console.warn("Instagram API Token is missing. Displaying mock data.");
    } else {
      // 実際のInstagram APIから最新6件を取得
      fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=6`)
        .then(response => response.json())
        .then(data => {
          if(data.data && data.data.length > 0) {
            igGrid.innerHTML = ''; // モックをクリア
            data.data.forEach(item => {
              const el = document.createElement('a');
              el.href = item.permalink;
              el.target = '_blank';
              el.className = 'ig-item';
              // 動画の場合はthumbnail_urlを使用
              const imgUrl = item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url;
              const captionTxt = item.caption ? item.caption.substring(0, 30) + '...' : 'Instagram Post';
              
              el.innerHTML = `
                <img src="${imgUrl}" alt="Instagram post" loading="lazy">
                <div class="ig-overlay">
                  <div class="ig-text">${captionTxt}</div>
                </div>
              `;
              igGrid.appendChild(el);
            });
          }
        })
        .catch(error => {
          console.error('Error fetching Instagram data:', error);
        });
    }
  }

  // Sticky CTA Scroll Logic
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        stickyCta.classList.add('is-visible');
      } else {
        stickyCta.classList.remove('is-visible');
      }
    });
  }

  // Setup Weekly Schedule (Card View Layout to remove empty slots)
  const scheduleContainer = document.getElementById('schedule-container');
  if (scheduleContainer) {
    const scheduleDataInfo = [
      { day: '月', events: [{start: '20:00', end: '22:00', name: '柔術 フリースパー', type: 'bjj', desc: 'スパーリングをご自由に行なっていただけます。'}, {start: '22:00', end: '23:00', name: '柔術 オープンマット', type: 'open', desc: '自由に練習や技術の復習ができるオープンな時間です。'}] },
      { day: '火', events: [{start: '20:00', end: '22:00', name: '柔術 オールレベル', type: 'bjj', desc: '初心者から上級者まで全員で基本から応用まで幅広く学びます。'}, {start: '22:00', end: '23:00', name: '柔術 オープンマット', type: 'open', desc: '自由に練習や技術の復習ができるオープンな時間です。'}] },
      { day: '水', events: [{start: '20:00', end: '23:00', name: '柔術 オープンマット', type: 'open', desc: '自由に練習や技術の復習ができるオープンな時間です。'}] },
      { day: '木', events: [{start: '20:00', end: '22:00', name: 'No-Gi オールレベル', type: 'nogi', desc: '道着を着ないグラップリングの基本から応用までを指導します。'}, {start: '22:00', end: '23:00', name: 'No-Gi オープンマット', type: 'open', desc: '自由にNo-Giの練習やスパーリングができる時間です。'}] },
      { day: '金', events: [{start: '20:00', end: '23:00', name: '柔術 オープンマット', type: 'open', desc: '自由に練習や技術の復習ができるオープンな時間です。'}] },
      { day: '土', events: [{start: '10:00', end: '12:00', name: '柔術 初級', type: 'bjj', desc: '未経験者・初心者向け。柔術の基本ムーブやポジションを丁寧に指導します。'}] },
      { day: '日', events: [{start: '終日', end: '', name: 'クローズ or イベント', type: 'event', desc: '通常クラスはお休みです。特設イベントやセミナーなどが開催される場合があります。'}] }
    ];

    let scheduleHTML = '<div class="concept-grid" style="grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 25px; margin-bottom: 20px;">';
    
    scheduleDataInfo.forEach(dayInfo => {
      scheduleHTML += `
        <div style="background:var(--white); padding:25px; border-radius:12px; box-shadow:0 6px 20px rgba(0,0,0,0.06); border-top: 5px solid var(--primary);">
          <h3 style="font-size: 1.3rem; margin-bottom: 20px; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; color:var(--black); font-weight:800; display:flex; align-items:center;">
            <i class="fa-regular fa-calendar-days" style="margin-right:10px; color:var(--primary);"></i> ${dayInfo.day}曜日
          </h3>
          <ul style="list-style:none; padding:0; margin:0;">
      `;
      if (dayInfo.events.length > 0) {
        dayInfo.events.forEach(ev => {
          let timeText = ev.end ? `${ev.start} - ${ev.end}` : ev.start;
          let colorTag = ev.type === 'bjj' ? 'var(--primary)' : (ev.type === 'nogi' ? '#2c3e50' : (ev.type === 'open' ? '#27ae60' : '#888'));
          scheduleHTML += `
            <li style="margin-bottom: 15px; display:flex; flex-direction:column; gap:6px; padding-bottom:15px; border-bottom:1px dashed #eee;">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                <span style="font-weight:900; color:var(--black); font-size:1.1rem;">${timeText}</span>
                <span style="display:inline-block; font-weight:700; color:#fff; background:${colorTag}; padding:4px 10px; border-radius:4px; font-size:0.9rem;">
                  ${ev.name}
                </span>
              </div>
              <div style="font-size:0.85rem; color:var(--text-light); line-height:1.4; margin-top:4px;">
                ${ev.desc}
              </div>
            </li>`;
        });
      } else {
         scheduleHTML += `<li style="color:var(--text-light); font-weight:bold; padding-top:10px;">休館日</li>`;
      }
      scheduleHTML += `</ul></div>`;
    });
    scheduleHTML += '</div>';

    // Legend
    scheduleHTML += `<div style="margin-top: 30px; display:flex; gap: 20px; justify-content:center; flex-wrap:wrap; font-weight:bold;">
       <span style="display:inline-flex; align-items:center; font-size:0.95rem;"><span style="display:inline-block; width:16px; height:16px; background:var(--primary); margin-right:6px; border-radius:4px;"></span> 柔術</span>
       <span style="display:inline-flex; align-items:center; font-size:0.95rem;"><span style="display:inline-block; width:16px; height:16px; background:#2c3e50; margin-right:6px; border-radius:4px;"></span> No-Gi</span>
       <span style="display:inline-flex; align-items:center; font-size:0.95rem;"><span style="display:inline-block; width:16px; height:16px; background:#27ae60; margin-right:6px; border-radius:4px;"></span> オープンマット</span>
    </div>`;

    scheduleContainer.innerHTML = scheduleHTML;
  }

  // FAQ Accordion Logic (For faq.html)
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => {
        item.classList.toggle('active');
      });
    });
  }
});
