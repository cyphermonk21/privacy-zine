// ===== Fetch Data =====
fetch('tools.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    initializePage(data);
  })
  .catch(err => {
    console.error('Failed to load tools.json:', err);
    showError(err);
  });

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

// ===== Stats =====
function initStats(data) {
  const statsEl = document.getElementById('stats-strip');
  if (!statsEl || !data.stats) return;
  
  statsEl.innerHTML = data.stats.map(stat => `
    <div class="stat-card">
      <span class="stat-value">${stat.value}</span>
      <span class="stat-label">${stat.label}</span>
      <span class="stat-caption">${stat.caption || ''}</span>
    </div>
  `).join('');
}

// ===== Intro Questions =====
function initIntro(data) {
  const introEl = document.getElementById('intro');
  if (!introEl || !data.intro?.questions) return;
  
  introEl.innerHTML = data.intro.questions.map(question => {
    const points = question.points.map(point => `<li>${point}</li>`).join('');
    return `
      <div class="intro-block">
        <h2>→ ${question.heading}</h2>
        <ul>${points}</ul>
      </div>
    `;
  }).join('');
}

// ===== Encryption Callout =====
function initEncryption(data) {
  const encEl = document.getElementById('encryption');
  if (!encEl || !data.intro?.encryption_blurb) return;
  
  const pEl = encEl.querySelector('p');
  if (pEl) {
    pEl.innerHTML = data.intro.encryption_blurb;
    encEl.classList.remove('hidden');
  }
}

// ===== Difficulty Filters =====
function initFilters() {
  const filterBar = document.getElementById('filter-bar');
  if (!filterBar) return;
  
  filterBar.classList.remove('hidden');
  
  const buttons = filterBar.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      buttons.forEach(b => b.classList.remove('active'));
      // Add active to clicked button
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      const categories = document.querySelectorAll('.category');
      
      categories.forEach(cat => {
        if (filter === 'all' || cat.dataset.difficulty === filter) {
          cat.style.display = '';
          setTimeout(() => cat.classList.add('fade-in'), 10);
        } else {
          cat.style.display = 'none';
          cat.classList.remove('fade-in');
        }
      });
    });
  });
}

// ===== Tool Categories =====
function initCategories(data) {
  const catEl = document.getElementById('categories');
  if (!catEl || !data.categories) return;
  
  data.categories.forEach((cat, index) => {
    const groupsHtml = cat.groups.map(group => {
      const toolsHtml = group.tools.map(tool => `
        <li>
          <a href="${tool.url}" target="_blank" rel="noopener noreferrer">
            <strong>${tool.name}</strong>
          </a>
          <span>${tool.note || ''}</span>
        </li>
      `).join('');
      
      const replacesHtml = group.replaces?.length
        ? `<p class="replaces">↪ Replaces: ${group.replaces.join(', ')}</p>`
        : '';
      
      const useCaseHtml = group.use_case
        ? `<p class="use-case">💡 ${group.use_case}</p>`
        : '';
      
      const quickWinHtml = group.quick_win
        ? `<p class="quick-win">✅ <strong>Quick win:</strong> ${group.quick_win}</p>`
        : '';
      
      const groupLabel = group.label ? `<h3 class="group-label">// ${group.label}</h3>` : '';
      
      return `
        <div class="tool-group">
          ${groupLabel}
          ${replacesHtml}
          ${useCaseHtml}
          ${quickWinHtml}
          <ul class="tools">${toolsHtml}</ul>
        </div>
      `;
    }).join('');
    
    const section = document.createElement('section');
    section.className = 'category fade-in';
    section.style.animationDelay = `${index * 0.05}s`;
    
    const difficulty = (cat.difficulty || 'easy').toLowerCase();
    section.dataset.difficulty = difficulty;
    section.id = cat.id || '';
    
    section.innerHTML = `
      <div class="cat-header">
        <span class="cat-emoji">${cat.emoji || '📍'}</span>
        <div>
          <h2>${cat.label}</h2>
          <p class="cat-tagline">${cat.tagline || ''}</p>
        </div>
        <span class="difficulty-badge diff-${difficulty}">${cat.difficulty || 'easy'}</span>
      </div>
      ${groupsHtml}
    `;
    
    catEl.appendChild(section);
  });
}

// ===== Reading List =====
function initReadingList(data) {
  const readEl = document.getElementById('reading-list');
  if (!readEl || !data.reading_list?.length) return;
  
  const bookList = readEl.querySelector('.book-list');
  if (!bookList) return;
  
  const books = data.reading_list.map(book => `
    <li>
      <div class="book-info">
        <span class="book-title">${book.title}</span>
        <span class="book-author">${book.author || ''}</span>
      </div>
      ${book.why ? `<span class="book-why">${book.why}</span>` : ''}
    </li>
  `).join('');
  
  bookList.innerHTML = books;
  readEl.classList.remove('hidden');
}

// ===== Resources =====
function initResources(data) {
  const resEl = document.getElementById('resources');
  if (!resEl || !data.resources) return;
  
  const resourceContainer = resEl.querySelector('.resource-container');
  if (!resourceContainer) return;
  
  let html = '';
  
  const sections = [
    { key: 'curated_lists', title: '// DIRECTORIES' },
    { key: 'articles', title: '// ARTICLES' },
    { key: 'tools', title: '// TOOLS' },
    { key: 'courses', title: '// COURSES' }
  ];
  
  sections.forEach(section => {
    const items = data.resources[section.key];
    if (items?.length) {
      html += `<h3>${section.title}</h3><ul class="resource-list">`;
      items.forEach(item => {
        html += `
          <li>
            <a href="${item.url}" target="_blank" rel="noopener noreferrer">
              <strong>${item.name}</strong>
            </a>
            <span>${item.note || item.source || ''}</span>
          </li>
        `;
      });
      html += '</ul>';
    }
  });
  
  resourceContainer.innerHTML = html;
  resEl.classList.remove('hidden');
}

// ===== Back to Top Button =====
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;
  
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

// ===== Error Handler =====
function showError(err) {
  console.error('[Privacy Toolkit] Error:', err);
  
  // Only show error UI if we're sure the page is waiting for data
  const categoriesEl = document.getElementById('categories');
  if (!categoriesEl) return;
  
  // If categories element is empty, show error
  if (!categoriesEl.innerHTML.trim()) {
    const errorMsg = err instanceof SyntaxError
      ? '⚠️ Your <code>tools.json</code> file has a syntax error.'
      : err.message?.includes('Failed to fetch')
        ? '⚠️ Could not find <code>tools.json</code> in root folder.'
        : '⚠️ Failed to load tool data.';
    
    categoriesEl.insertAdjacentHTML('afterbegin', `
      <div class="error">
        ${errorMsg}<br>
        <small>Check browser console (F12) for details.</small>
      </div>
    `);
  }
}
