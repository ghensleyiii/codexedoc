let articles = JSON.parse(localStorage.getItem('articles')) || [];
        let editingArticleId = null;
        let openArticles = new Set();
        let isDeleteConfirmed = false;
        displayArticles(articles);

        function saveOrUpdateArticle() {
            const title = document.getElementById('titleInput').value;
            const notes = document.getElementById('notesInput').value;
            const order = parseInt(document.getElementById('orderInput').value) || 0;
            const saveBtn = document.getElementById('saveBtn');
            const deleteBtn = document.getElementById('deleteBtn');
            
            if (title && notes) {
                if (editingArticleId) {
                    const articleIndex = articles.findIndex(a => a.id === editingArticleId);
                    articles[articleIndex] = {
                        ...articles[articleIndex],
                        title: title,
                        notes: notes,
                        order: order,
                        date: new Date().toLocaleString()
                    };
                    editingArticleId = null;
                    saveBtn.textContent = 'Save Article';
                    deleteBtn.style.display = 'none';
                    isDeleteConfirmed = false;
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.classList.remove('confirm');
                } else {
                    const article = {
                        id: Date.now(),
                        title: title,
                        notes: notes,
                        order: order,
                        date: new Date().toLocaleString()
                    };
                    articles.push(article);
                }
                
                localStorage.setItem('articles', JSON.stringify(articles));
                document.getElementById('titleInput').value = '';
                document.getElementById('orderInput').value = '';
                document.getElementById('notesInput').value = '';
                displayArticles(articles);
            }
        }

        function editArticle(id) {
            const article = articles.find(a => a.id === id);
            if (article) {
                document.getElementById('titleInput').value = article.title;
                document.getElementById('orderInput').value = article.order;
                document.getElementById('notesInput').value = article.notes;
                editingArticleId = id;
                const saveBtn = document.getElementById('saveBtn');
                const deleteBtn = document.getElementById('deleteBtn');
                saveBtn.textContent = 'Update Article';
                deleteBtn.style.display = 'block';
                isDeleteConfirmed = false;
                deleteBtn.textContent = 'Delete';
                deleteBtn.classList.remove('confirm');
            }
        }

        function deleteArticle() {
            const deleteBtn = document.getElementById('deleteBtn');
            if (!isDeleteConfirmed) {
                isDeleteConfirmed = true;
                deleteBtn.textContent = 'Confirm Delete';
                deleteBtn.classList.add('confirm');
            } else {
                if (editingArticleId) {
                    articles = articles.filter(a => a.id !== editingArticleId);
                    localStorage.setItem('articles', JSON.stringify(articles));
                    editingArticleId = null;
                    isDeleteConfirmed = false;
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.classList.remove('confirm');
                    deleteBtn.style.display = 'none';
                    document.getElementById('titleInput').value = '';
                    document.getElementById('orderInput').value = '';
                    document.getElementById('notesInput').value = '';
                    document.getElementById('saveBtn').textContent = 'Save Article';
                    displayArticles(articles);
                }
            }
        }

        function updateOrder(id, newOrder) {
            const articleIndex = articles.findIndex(a => a.id === id);
            if (articleIndex !== -1) {
                articles[articleIndex].order = parseInt(newOrder) || 0;
                localStorage.setItem('articles', JSON.stringify(articles));
                displayArticles(articles);
            }
        }

        function toggleArticle(id) {
            if (openArticles.has(id)) {
                openArticles.delete(id);
            } else {
                openArticles.add(id);
            }
            displayArticles(articles);
        }

        function highlightText(text, searchTerm) {
            if (!searchTerm) return text;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        }

        function formatNotes(notes) {
            return notes.replace(/\n/g, '<br>');
        }

        function getPreviewText(notes, searchTerm, isOpen) {
            const maxPreviewLength = 85;
            const contextLength = 30;

            let formattedNotes = formatNotes(notes);

            if (isOpen) {
                return highlightText(formattedNotes, searchTerm);
            }

            if (searchTerm) {
                const lowerNotes = notes.toLowerCase();
                const lowerSearch = searchTerm.toLowerCase();
                const index = lowerNotes.indexOf(lowerSearch);
                if (index !== -1) {
                    const start = Math.max(0, index - contextLength);
                    const end = Math.min(notes.length, index + searchTerm.length + contextLength);
                    let preview = notes.substring(start, end);
                    if (start > 0) preview = '...' + preview;
                    if (end < notes.length) preview += '...';
                    return highlightText(formatNotes(preview), searchTerm);
                }
            }

            return notes.length > maxPreviewLength 
                ? highlightText(formatNotes(notes.substring(0, maxPreviewLength)) + '...', searchTerm) 
                : highlightText(formattedNotes, searchTerm);
        }

        function displayArticles(articlesToShow) {
            const container = document.getElementById('articlesContainer');
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            container.innerHTML = '';
            
            const sortedArticles = [...articlesToShow].sort((a, b) => {
                if (a.order === b.order) {
                    return a.title.localeCompare(b.title);
                }
                return a.order - b.order;
            });
            
            sortedArticles.forEach(article => {
                const isOpen = openArticles.has(article.id);
                const articleDiv = document.createElement('div');
                articleDiv.className = 'article';
                const highlightedTitle = highlightText(article.title, searchTerm);
                const previewNotes = getPreviewText(article.notes, searchTerm, isOpen);
                const showOpenLink = article.notes.length > 85 || (searchTerm && !isOpen);

                articleDiv.innerHTML = `
                    <h2>${highlightedTitle}</h2>
                    <p class="notes-preview">${previewNotes}</p>
                    <div class="article-footer">
                        <small>Created: ${article.date}</small>
                        <div class="order-controls">
                            <input type="number" class="order-input" value="${article.order || 0}" 
                                onchange="updateOrder(${article.id}, this.value)">
                            ${showOpenLink ? `<span class="open-link" onclick="toggleArticle(${article.id})">${isOpen ? 'Close' : 'Open'}</span>` : ''}
                            <span class="edit-link" onclick="editArticle(${article.id})">Edit</span>
                        </div>
                    </div>
                `;
                container.appendChild(articleDiv);
            });
        }

        function searchArticles() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const filteredArticles = articles.filter(article => 
                article.title.toLowerCase().includes(searchTerm) || 
                article.notes.toLowerCase().includes(searchTerm)
            );
            displayArticles(filteredArticles);
        }

        function backupData() {
            const data = {
                articles: JSON.parse(localStorage.getItem('articles')) || []
            };
            
            const codexContent = `CODEX-EDOC-BACKUP-v1\n${JSON.stringify(data, null, 2)}`;
            const blob = new Blob([codexContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bulletins_backup_${new Date().toISOString().split('T')[0]}.codex`;
            a.click();
            URL.revokeObjectURL(url);
        }

        function isPlainObject(obj) {
            return obj !== null && typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
        }

        function restoreData(event) {
            const file = event.target.files[0];
            const restoreInput = document.getElementById('restoreInput');
            
            if (!file) {
                alert('Error: No file selected');
                console.error('No file selected');
                restoreInput.value = '';
                return;
            }

            try {
                const validExtensions = ['.codex', '.json'];
                const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
                if (!validExtensions.includes(fileExtension)) {
                    alert('Error: Invalid file type. Please select a .codex or .json file.');
                    console.error('Invalid file extension:', fileExtension);
                    restoreInput.value = '';
                    return;
                }
                if (file.size === 0) {
                    alert('Error: File is empty');
                    console.error('Empty file detected');
                    restoreInput.value = '';
                    return;
                }
                if (file.size > 10 * 1024 * 1024) {
                    alert('Error: File is too large (max 10MB)');
                    console.error('File size too large:', file.size);
                    restoreInput.value = '';
                    return;
                }
            } catch (error) {
                alert('Error: Failed to validate file properties');
                console.error('File validation error:', error.message, error.stack);
                restoreInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    let content = e.target.result;
                    content = content.replace(/^\uFEFF/, '').trim();
                    if (!content) {
                        alert('Error: File is empty or contains only whitespace');
                        console.error('Empty or whitespace-only content');
                        restoreInput.value = '';
                        return;
                    }

                    let data;
                    const isCodex = content.startsWith('CODEX-EDOC-BACKUP-v1');
                    let jsonContent;

                    if (isCodex) {
                        const lines = content.split('\n');
                        if (lines[0].trim() !== 'CODEX-EDOC-BACKUP-v1') {
                            throw new Error('Invalid .codex file header');
                        }
                        jsonContent = lines.slice(1).join('\n').trim();
                        if (!jsonContent) {
                            throw new Error('No JSON data found after header');
                        }
                    } else {
                        jsonContent = content;
                    }

                    if (!jsonContent.startsWith('{') && !jsonContent.startsWith('[')) {
                        throw new Error('Invalid JSON: Content must start with an object or array');
                    }

                    try {
                        data = JSON.parse(jsonContent);
                    } catch (parseError) {
                        const match = parseError.message.match(/at position (\d+)/);
                        const position = match ? parseInt(match[1]) : -1;
                        let errorContext = '';
                        if (position >= 0) {
                            const start = Math.max(0, position - 20);
                            const end = Math.min(jsonContent.length, position + 20);
                            errorContext = ` near "${jsonContent.slice(start, end)}"`;
                        }
                        throw new Error(`Invalid JSON format: ${parseError.message}${errorContext}`);
                    }

                    if (!isPlainObject(data)) {
                        throw new Error('Invalid data structure: Root must be an object');
                    }

                    const articlesData = Array.isArray(data.articles) ? data.articles : [];
                    const validArticles = articlesData.filter(article => {
                        return isPlainObject(article) &&
                               typeof article.id === 'number' &&
                               typeof article.title === 'string' &&
                               typeof article.notes === 'string' &&
                               typeof article.date === 'string' &&
                               (typeof article.order === 'number' || article.order === undefined);
                    });

                    if (validArticles.length !== articlesData.length) {
                        console.warn('Some articles were invalid and filtered out:', articlesData);
                    }

                    try {
                        localStorage.setItem('articles', JSON.stringify(validArticles));
                        articles.length = 0;
                        articles.push(...validArticles);
                        openArticles.clear();
                        displayArticles(articles);
                    } catch (error) {
                        throw new Error(`Failed to apply articles: ${error.message}`);
                    }

                    if (validArticles.length !== articlesData.length) {
                        alert('Data restored successfully, but some invalid articles were ignored.');
                    } else {
                        alert('Data restored successfully!');
                    }
                } catch (error) {
                    let errorMessage = 'Error restoring data: ';
                    if (error.message.includes('codex file header')) {
                        errorMessage += 'Invalid .codex file header. File must start with "CODEX-EDOC-BACKUP-v1".';
                    } else if (error.message.includes('JSON data found')) {
                        errorMessage += 'No JSON data found in .codex file after header.';
                    } else if (error.message.includes('Invalid JSON')) {
                        errorMessage += `File contains invalid JSON: ${error.message}`;
                    } else if (error.message.includes('data structure')) {
                        errorMessage += 'Invalid data format. Expected an array for articles.';
                    } else if (error.message.includes('apply articles')) {
                        errorMessage += `Failed to update articles: ${error.message}`;
                    } else {
                        errorMessage += `Unexpected error: ${error.message}`;
                    }
                    alert(errorMessage);
                    console.error('Restore error:', error.message, error.stack);
                }
                restoreInput.value = '';
            };
            reader.onerror = function() {
                alert('Error: Failed to read file');
                console.error('FileReader error');
                restoreInput.value = '';
            };
            reader.readAsText(file);
        }

        document.addEventListener('DOMContentLoaded', () => {
            const backupBtn = document.getElementById('backupBtn');
            const restoreBtn = document.getElementById('restoreBtn');
            const restoreInput = document.getElementById('restoreInput');

            backupBtn.addEventListener('click', backupData);
            restoreBtn.addEventListener('click', () => restoreInput.click());
            restoreInput.addEventListener('change', restoreData);
        });
