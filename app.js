// ===== Fetch Data =====
fetch('tools.json')
  .then(r => r.json())
  .then(data => initializePage(data))
  .catch(err => showError(err));

function initializePage(data) {
  initHero(data);
  initStats(data);
  initIntro(data);
  initEncryption(data);
  initFilters();
  initCategories(data);
  initReadingList(data);
  initResources(data);
  initBackToTop();
}

// ===== Hero Section =====
function initHero(data) {
  const heroSubhead = document.getElementById('hero-subhead');
  if (heroSubhead && data.intro?.hero?.subhead) {
    heroSubhead.textContent = data.intro.hero.subhead;
  }
}

// ===== Stats Counter Animation =====
function initStats(data) {
  const statsEl = document.getElementById('stats-strip');
  if (!data.stats) return;
  
  statsEl.innerHTML = data.stats.map(s => `
    <div class="stat-card">
      <span class="stat-value">${s.value}</span>
      <span class="stat-label">${s.label}</span>
      <span class="stat-caption">${s.caption}</span>
    </div>
  `).join('');
}

// ===== Intro Questions =====
function initIntro(data) {
  const introEl = document.getElementById('intro');
  if (!data.intro?.questions) return;
  
  introEl.innerHTML = data.intro.questions.map(q => {
    const points = q.points.map(p => `<li>${p}</li>`).join('');
    return `<div class="intro-block">
      <h2>${q.heading}</h2>
      <ul>${points}</ul>
    </div>`;
  }).join('');
}

// ===== Encryption Callout =====
function initEncryption(data) {
  if (data.intro?.encryption_blurb) {
    const encEl = document.getElementById('encryption');
    encEl.querySelector('p').innerHTML = data.intro.encryption_blurb;
    encEl.classList.remove('hidden');
  }
}

// ===== Difficulty Filter - Fixed mapping =====
function initFilters() {
  document.getElementById('filter-bar').classList.remove('hidden');
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      
      document.querySelectorAll('.category').forEach(cat => {
        if (filter === 'all' || cat.dataset.difficulty === filter) {
          cat.style.display = '';
          cat.classList.add('fade-in');
          setTimeout(() => cat.classList.remove('fade-in'), 600);
        } else {
          cat.style.display = 'none';
        }
      });
    });
  });
}

// ===== Categories =====
function initCategories(data) {
  const catEl = document.getElementById('categories');
  
  data.categories.forEach((cat, index) => {
    const groupsHtml = cat.groups.map(g => {
      const tools = g.tools.map(t =>
        `<li>
          <a href="${t.url}" target="_blank" rel="noopener noreferrer">
            <strong>${t.name}</strong>
          </a>
          <span>${t.note || ''}</span>
        </li>`
      ).join('');
      
      const replaces = g.replaces?.length
        ? `<p class="replaces">↪ Replaces: ${g.replaces.join(', ')}</p>`
        : '';
      
      const useCase = g.use_case
        ? `<p class="use-case">💡 ${g.use_case}</p>`
        : '';
      
      const quickWin = g.quick_win
        ? `<p class="quick-win">✅ <strong>Quick win:</strong> ${g.quick_win}</p>`
        : '';
      
      const groupLabel = g.label ? `<h3 class="group-label">${g.label}</h3>` : '';
      
      return `<div class="tool-group">${groupLabel}${replaces}${useCase}${quickWin}<ul class="tools">${tools}</ul></div>`;
    }).join('');
    
    const section = document.createElement('section');
    section.className = 'category fade-in';
    section.style.animationDelay = `${index * 0.1}s`;
    
    // ✅ Fixed: Map to easy/medium/hard consistently
    const difficultyMap = {
      'easy': 'easy',
      'medium': 'medium',
      'hard': 'hard',
      'varies': 'varies'
    };
    section.dataset.difficulty = difficultyMap[cat.difficulty?.toLowerCase()] || 'easy';
    
    section.id = cat.id;
    
    section.innerHTML = `
      <div class="cat-header">
        <span class="cat-emoji">${cat.emoji || '📍'}</span>
        <div>
          <h2>${cat.label}</h2>
          <p class="cat-tagline">${cat.tagline || ''}</p>
        </div>
        <span class="difficulty-badge diff-${cat.difficulty?.toLowerCase() || 'easy'}">${cat.difficulty || 'easy'}</span>
      </div>
      ${groupsHtml}
    `;
    
    catEl.appendChild(section);
  });
}

// ===== Reading List =====
function initReadingList(data) {
  const readEl = document.getElementById('reading-list');
  if (!data.reading_list?.length) return;
  
  readEl.classList.remove('hidden');
  
  const books = data.reading_list.map(b =>
    `<li>
      <div class="book-info">
        <span class="book-title">${b.title}</span>
        <span class="book-author">${b.author}</span>
      </div>
      ${b.why ? `<span class="book-why">${b.why}</span>` : ''}
    </li>`
  ).join('');
  
  readEl.innerHTML = `
    <h2>📚 Want to go deeper?</h2>
    <p class="section-subtitle">Books that shaped the privacy movement</p>
    <ul class="book-list">${books}</ul>
  `;
}

// ===== Resources =====
function initResources(data) {
  const resEl = document.getElementById('resources');
  if (!data.resources) return;
  
  resEl.classList.remove('hidden');
  
  let html = '<h2>🔗 Level Up Your Privacy Game</h2>';
  html += '<p class="section-subtitle">Curated resources from the community</p>';
  
  const sections = [
    { key: 'curated_lists', title: '📑 Directories & Lists' },
    { key: 'articles', title: '📖 Articles & Blog Posts' },
    { key: 'tools', title: '🛠️ Utility Tools' },
    { key: 'courses', title: '📚 Courses' }
  ];
  
  sections.forEach(sec => {
    const items = data.resources[sec.key];
    if (items?.length) {
      html += `<h3>${sec.title}</h3><ul class="resource-list">`;
      items.forEach(r => {
        html += `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer"><strong>${r.name}</strong></a><span>${r.note || r.source || ''}</span></li>`;
      });
      html += '</ul>';
    }
  });
  
  resEl.innerHTML = html;
}

// ===== Back to Top Button =====
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== Error Handling =====
function showError(err) {
  console.error('Full error:', err);
  
  let errorMsg = '⚠️ Failed to load tool data.';
  
  if (err instanceof SyntaxError) {
    errorMsg = '⚠️ Your <code>tools.json</code> file has a syntax error.';
  } else if (err.message?.includes('Failed to fetch') || err instanceof TypeError) {
    errorMsg = '⚠️ Could not find <code>tools.json</code>.';
  }
  
  const categoriesEl = document.getElementById('categories');
  categoriesEl.innerHTML = `
    <div class="error">
      ${errorMsg}<br>
      <small>Check browser console (F12) for details.</small>
    </div>
  `;
}// ===== Fetch Data =====
fetch('tools.json')
  .then(r => r.json())
  .then(data => initializePage(data))
 .catch(err => showError(err));

function initializePage(data) {
  initHero(data);
  initStats(data);
  initIntro(data);
  initEncryption(data);
  initFilters();
  initCategories(data);
  initReadingList(data);
  initResources(data);
  initBackToTop();
}

// ===== Hero Section =====
function initHero(data) {
  const heroSubhead = document.getElementById('hero-subhead');
  if (heroSubhead && data.intro?.hero?.subhead) {
    heroSubhead.textContent = data.intro.hero.subhead;
  }
}

// ===== Stats Counter Animation =====
function initStats(data) {
  const statsEl = document.getElementById('stats-strip');
  if (!data.stats) return;
  
  statsEl.innerHTML = data.stats.map(s => `
    <div class="stat-card">
      <span class="stat-value">${s.value}</span>
      <span class="stat-label">${s.label}</span>
      <span class="stat-caption">${s.caption}</span>
    </div>
  `).join('');
}

// ===== Intro Questions =====
function initIntro(data) {
  const introEl = document.getElementById('intro');
  if (!data.intro?.questions) return;
  
  introEl.innerHTML = data.intro.questions.map(q => {
    const points = q.points.map(p => `<li>${p}</li>`).join('');
    return `<div class="intro-block">
      <h2>${q.heading}</h2>
      <ul>${points}</ul>
    </div>`;
  }).join('');
}

// ===== Encryption Callout =====
function initEncryption(data) {
  if (data.intro?.encryption_blurb) {
    const encEl = document.getElementById('encryption');
    encEl.querySelector('p').innerHTML = data.intro.encryption_blurb;
    encEl.classList.remove('hidden');
  }
}

// ===== Difficulty Filter =====
function initFilters() {
  document.getElementById('filter-bar').classList.remove('hidden');
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      
      document.querySelectorAll('.category').forEach(cat => {
        if (filter === 'all' || cat.dataset.difficulty === filter) {
          cat.style.display = '';
          cat.classList.add('fade-in');
          setTimeout(() => cat.classList.remove('fade-in'), 600);
        } else {
          cat.style.display = 'none';
        }
      });
    });
  });
}

// ===== Categories =====
function initCategories(data) {
  const catEl = document.getElementById('categories');
  
  data.categories.forEach((cat, index) => {
    const groupsHtml = cat.groups.map(g => {
      const tools = g.tools.map(t =>
        `<li>
          <a href="${t.url}" target="_blank" rel="noopener noreferrer">
            <strong>${t.name}</strong>
          </a>
          <span>${t.note || ''}</span>
        </li>`
      ).join('');
      
      const replaces = g.replaces?.length
        ? `<p class="replaces">↪ Replaces: ${g.replaces.join(', ')}</p>`
        : '';
      
      const useCase = g.use_case
        ? `<p class="use-case">💡 ${g.use_case}</p>`
        : '';
      
      const quickWin = g.quick_win
        ? `<p class="quick-win">✅ <strong>Quick win:</strong> ${g.quick_win}</p>`
        : '';
      
      const groupLabel = g.label ? `<h3 class="group-label">${g.label}</h3>` : '';
      
      return `<div class="tool-group">${groupLabel}${replaces}${useCase}${quickWin}<ul class="tools">${tools}</ul></div>`;
    }).join('');
    
    const section = document.createElement('section');
    section.className = 'category fade-in';
    section.style.animationDelay = `${index * 0.1}s`;
    section.dataset.difficulty = cat.difficulty || 'easy';
    section.id = cat.id;
    
    section.innerHTML = `
      <div class="cat-header">
        <span class="cat-emoji">${cat.emoji || '📍'}</span>
        <div>
          <h2>${cat.label}</h2>
          <p class="cat-tagline">${cat.tagline || ''}</p>
        </div>
        <span class="difficulty-badge diff-${cat.difficulty || 'easy'}">${cat.difficulty || 'easy'}</span>
      </div>
      ${groupsHtml}
    `;
    
    catEl.appendChild(section);
  });
}

// ===== Reading List =====
function initReadingList(data) {
  const readEl = document.getElementById('reading-list');
  if (!data.reading_list?.length) return;
  
  readEl.classList.remove('hidden');
  
  const books = data.reading_list.map(b =>
    `<li>
      <div class="book-info">
        <span class="book-title">${b.title}</span>
        <span class="book-author">${b.author}</span>
      </div>
      ${b.why ? `<span class="book-why">${b.why}</span>` : ''}
    </li>`
  ).join('');
  
  readEl.innerHTML = `
    <h2>📚 Want to go deeper?</h2>
    <p class="section-subtitle">Books that shaped the privacy movement</p>
    <ul class="book-list">${books}</ul>
  `;
}

// ===== Resources =====
function initResources(data) {
  const resEl = document.getElementById('resources');
  if (!data.resources) return;
  
  resEl.classList.remove('hidden');
  
  let html = '<h2>🔗 Level Up Your Privacy Game</h2>';
  html += '<p class="section-subtitle">Curated resources from the community</p>';
  
  const sections = [
    { key: 'curated_lists', title: '📑 Directories & Lists' },
    { key: 'articles', title: '📖 Articles & Blog Posts' },
    { key: 'tools', title: '🛠️ Utility Tools' },
    { key: 'courses', title: '📚 Courses' }
  ];
  
  sections.forEach(sec => {
    const items = data.resources[sec.key];
    if (items?.length) {
      html += `<h3>${sec.title}</h3><ul class="resource-list">`;
      items.forEach(r => {
        html += `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer"><strong>${r.name}</strong></a><span>${r.note || r.source || ''}</span></li>`;
      });
      html += '</ul>';
    }
  });
  
  resEl.innerHTML = html;
}

// ===== Back to Top Button =====
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== Error Handling =====
function showError(err) {
  console.error('Full error:', err);
  
  let errorMsg = '⚠️ Failed to load tool data.';
  
  if (err instanceof SyntaxError) {
    errorMsg = '⚠️ Your <code>tools.json</code> file has a syntax error. Check for trailing commas, missing commas, or unclosed brackets.';
  } else if (err.message?.includes('Failed to fetch') || err instanceof TypeError) {
    errorMsg = '⚠️ Could not find <code>tools.json</code>. Make sure it exists in the root folder.';
  }
  
  const categoriesEl = document.getElementById('categories');
  categoriesEl.innerHTML = `
    <div class="error">
      ${errorMsg}<br>
      <small>Check browser console (F12) for details.</small>
    </div>
  `;
}
