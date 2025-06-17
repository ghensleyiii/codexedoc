const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');

// Clean query: remove non-word characters except spaces
function cleanQuery(query) {
    return query.replace(/[^\w\s]/gi, '').trim().toLowerCase();
}

// Function to highlight search terms in text
function highlight(text, query) {
    if (!query) return text;
    // Escape special regex characters in query
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Function to rank results based on position and field
function rankResult(item, query) {
    const c = cleanQuery(item.c);
    const d = cleanQuery(item.d);
    const e = cleanQuery(item.e);

    // Lower score = higher rank
    let score = Infinity;

    // Check in c (title)
    const posC = c.indexOf(query);
    if (posC === 0) score = 1; // beginning of c
    else if (posC > 0) score = 2; // elsewhere in c

    // Check in d (description)
    const posD = d.indexOf(query);
    if (score > 3 && posD === 0) score = 3; // beginning of d
    else if (score > 4 && posD > 0) score = 4; // elsewhere in d

    // Check in e (example)
    const posE = e.indexOf(query);
    if (score > 5 && posE === 0) score = 5; // beginning of e
    else if (score > 6 && posE > 0) score = 6; // elsewhere in e

    return score;
}

// Function to display results with highlights
function displayResults(results, query) {
    resultsDiv.innerHTML = '';
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p style="color: white; text-align: center; padding: 1rem;">No results found.</p>';
        return;
    }
    results.forEach(item => {
        const box = document.createElement('div');
        box.className = 'result-box';
        box.innerHTML = `
            <div class="result-title">${highlight(item.c, query)}</div>
            <div class="result-desc">${highlight(item.d, query)}</div>
            <pre>${highlight(item.e, query)}</pre>
        `;
        resultsDiv.appendChild(box);
    });
}

// Function to handle search
function handleSearch() {
    const rawQuery = searchInput.value.trim();
    const query = cleanQuery(rawQuery);
    if (query === '') {
        resultsDiv.innerHTML = '';
        return;
    }
    // Filter and rank
    const filtered = components
        .filter(item =>
            cleanQuery(item.c).includes(query) ||
            cleanQuery(item.d).includes(query) ||
            cleanQuery(item.e).includes(query)
        )
        .map(item => ({
            item,
            score: rankResult(item, query)
        }))
        .sort((a, b) => a.score - b.score)
        .map(obj => obj.item);

    displayResults(filtered, query);
}

// Listen for input changes
searchInput.addEventListener('input', handleSearch);

// Reveal on scroll logic
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
    for (const el of reveals) {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 100; // Adjust for when to trigger

        if (elementTop < windowHeight - revealPoint) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    }
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
