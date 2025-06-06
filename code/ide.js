window.onerror = function(message, source, lineno, colno, error) {
  console.error(`Global error: ${message} at ${source}:${lineno}:${colno}`);
  alert(`A script error occurred: ${message}. Check the console for details.`);
  return true;
};

let files = {
  'html-index': { type: 'html', content: '', filename: 'index.html' },
  'css-style': { type: 'css', content: '', filename: 'style.css' },
  'js-script': { type: 'js', content: '', filename: 'script.js' }
};

let editors = {};
let currentTab = 'html-index';
let lastHtmlTab = 'html-index';
let currentProject = null;
let searchMatches = [];
let currentMatchIndex = -1;

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function initializeCodeMirror(textarea, mode) {
  try {
    console.log(`Initializing CodeMirror for textarea ${textarea.id} with mode ${mode}`);
    const editor = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      mode: mode,
      theme: 'monokai',
      lineWrapping: true,
      tabSize: 2,
      indentWithTabs: false,
      scrollbarStyle: 'native',
      matchBrackets: true,
      autoCloseTags: true,
      autoCloseBrackets: true
    });
    console.log(`CodeMirror initialized successfully for ${textarea.id}`);
    editor.on('change', debounce(() => {
      const fileId = textarea.id.replace('editor-', '');
      files[fileId].content = editor.getValue();
      console.log(`Content updated for ${fileId}`);
    }, 300));
    return editor;
  } catch (error) {
    console.error(`Error initializing CodeMirror for ${textarea.id}:`, error);
    alert(`Failed to initialize editor for ${textarea.id}. Check console for details.`);
    return null;
  }
}

function getModeForFileType(type) {
  const mode = type === 'html' ? 'htmlmixed' :
               type === 'css' ? 'css' :
               type === 'js' || type === 'jsx' ? 'javascript' :
               type === 'py' ? 'python' : 'text/plain';
  console.log(`File type ${type} mapped to mode ${mode}`);
  return mode;
}

function updateButtonStates() {
  const selectAllBtn = document.getElementById('selectAllBtn');
  const saveBtn = document.getElementById('saveBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  const findReplaceBtn = document.getElementById('findReplaceBtn');
  const openProjectBtn = document.getElementById('openProjectBtn');
  const deleteProjectBtn = document.getElementById('deleteProjectBtn');

  const isBrowserTab = currentTab === 'browser';
  selectAllBtn.disabled = isBrowserTab;
  saveBtn.disabled = isBrowserTab;
  deleteBtn.disabled = isBrowserTab || Object.keys(files).length <= 1;
  findReplaceBtn.disabled = isBrowserTab || !document.getElementById('findText').value;
  openProjectBtn.disabled = !document.getElementById('projectList').value;
  deleteProjectBtn.disabled = !document.getElementById('projectList').value;
}

function loadInitialFiles() {
  try {
    console.log('Loading initial files...');
    for (let fileId in files) {
      const textarea = document.getElementById(`editor-${fileId}`);
      if (!textarea) {
        console.error(`Textarea not found for fileId: ${fileId}`);
        continue;
      }
      if (!editors[fileId]) {
        files[fileId].content = textarea.value;
        const mode = getModeForFileType(files[fileId].type);
        editors[fileId] = initializeCodeMirror(textarea, mode);
        if (editors[fileId]) {
          editors[fileId].setValue(files[fileId].content);
          console.log(`Editor initialized for ${fileId}`);
          // Additional check for HTML syntax highlighting
          if (files[fileId].type === 'html') {
            console.log(`Verifying syntax highlighting for ${fileId}:`, editors[fileId].getOption('mode'));
          }
        } else {
          console.error(`Failed to initialize editor for ${fileId}`);
        }
      }
    }
    if (!files[lastHtmlTab] || files[lastHtmlTab].type !== 'html') {
      const htmlFiles = Object.keys(files).filter(id => files[id].type === 'html');
      lastHtmlTab = htmlFiles.length > 0 ? htmlFiles[0] : null;
      console.log(`Last HTML tab updated to: ${lastHtmlTab}`);
    }
    updateButtonStates();
    loadProjects();
    switchTab('html-index');

    // Debug File Bar button order
    const fileBar = document.querySelector('.file-bar');
    console.log('File Bar children order:', Array.from(fileBar.children).map(child => child.id || child.tagName));
  } catch (error) {
    console.error('Error loading initial files:', error);
    alert('Failed to load initial files. Check console for details.');
  }
}

function switchTab(tabId) {
  console.log(`Switching to tab: ${tabId}`);
  try {
    if (currentTab !== 'browser' && editors[currentTab]) {
      files[currentTab].content = editors[currentTab].getValue();
      editors[currentTab].getInputField().blur();
    }

    const tabButton = document.querySelector(`.tab[data-file-id="${tabId}"], .tab[onclick="switchTab('${tabId}')"]`);
    if (!tabButton) throw new Error(`Tab button for ${tabId} not found`);
    const editorArea = document.getElementById(tabId);
    if (!editorArea) throw new Error(`Editor area for ${tabId} not found`);

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tabButton.classList.add('active');

    document.querySelectorAll('.editor-area').forEach(e => e.classList.remove('visible'));
    editorArea.classList.add('visible');

    currentTab = tabId;
    if (files[tabId]?.type === 'html') lastHtmlTab = tabId;

    updateButtonStates();
    updateFindReplaceButton();

    if (tabId === 'browser') {
      runCode();
    } else if (editors[tabId]) {
      setTimeout(() => {
        editors[tabId].refresh();
        editors[tabId].focus();
        console.log(`Editor refreshed and focused for ${tabId}`);
        const findText = document.getElementById('findText').value;
        if (findText) searchAndHighlight(findText);
      }, 50);
    } else {
      console.error(`Editor not found for ${tabId}`);
    }
  } catch (error) {
    console.error(`Error switching to tab ${tabId}:`, error);
    alert(`Failed to switch to tab ${tabId}. Check console for details.`);
  }
}

function runCode() {
  console.log('Running code for browser preview');
  try {
    if (currentTab !== 'browser' && editors[currentTab]) {
      files[currentTab].content = editors[currentTab].getValue();
    }

    let htmlContent = lastHtmlTab && files[lastHtmlTab]?.type === 'html' ? files[lastHtmlTab].content : '<html><body><h1>No HTML file available</h1></body></html>';
    let cssContent = '';
    let jsContent = '';

    for (let id in files) {
      if (files[id].type === 'css') cssContent += files[id].content + '\n';
      else if (files[id].type === 'js') jsContent += files[id].content + '\n';
    }

    const fullCode = `
      <html>
        <head><style>${cssContent}</style></head>
        <body>${htmlContent}<script>${jsContent}<\/script></body>
      </html>
    `;

    const previewIframe = document.getElementById('preview');
    const oldSrc = previewIframe.src;
    const blob = new Blob([fullCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    previewIframe.src = url;
    if (oldSrc.startsWith('blob:')) {
      setTimeout(() => URL.revokeObjectURL(oldSrc), 100);
    }
  } catch (error) {
    console.error('Error generating preview:', error);
    document.getElementById('preview').contentDocument.body.innerHTML = '<h1>Error rendering preview</h1>';
  }
}

function selectAllCode() {
  console.log('Select All button clicked');
  if (currentTab !== 'browser' && editors[currentTab]) {
    editors[currentTab].execCommand('selectAll');
    editors[currentTab].refresh();
    editors[currentTab].focus();
  }
}

function triggerFileInput() {
  console.log('Import button clicked');
  document.getElementById('fileInput').click();
}

function handleFileImport(event) {
  console.log('File selected for import');
  const file = event.target.files[0];
  if (!file) return;

  const fileName = file.name;
  const fileExt = fileName.split('.').pop().toLowerCase();
  if (!['html', 'css', 'js', 'jsx', 'py'].includes(fileExt)) {
    alert('Unsupported file type. Please select a .html, .css, .js, .jsx, or .py file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const content = e.target.result;
      const type = fileExt;
      const name = fileName.replace(/\.[^/.]+$/, '');
      const fileId = `${type}-${name.replace(/\s+/g, '-')}`;

      if (files[fileId]) {
        alert(`File ${fileName} already exists. Please rename or select a different file.`);
        return;
      }

      const tab = document.createElement('button');
      tab.className = 'tab';
      tab.textContent = fileName;
      tab.setAttribute('data-file-id', fileId);
      tab.onclick = () => switchTab(fileId);
      document.querySelector('.tabs').insertBefore(tab, document.querySelector('.tab[onclick="switchTab(\'browser\')"]'));

      const editorArea = document.createElement('div');
      editorArea.id = fileId;
      editorArea.className = 'editor-area';
      const textarea = document.createElement('textarea');
      textarea.id = `editor-${fileId}`;
      textarea.className = 'code-editor';
      textarea.value = content;
      editorArea.appendChild(textarea);
      document.querySelector('.container').appendChild(editorArea);

      files[fileId] = { type, content, filename: fileName };
      const mode = getModeForFileType(type);
      editors[fileId] = initializeCodeMirror(textarea, mode);

      setTimeout(() => {
        switchTab(fileId);
        editors[fileId].refresh();
        editors[fileId].focus();
      }, 100);

      document.getElementById('fileInput').value = '';
    } catch (error) {
      console.error('Error importing file:', error);
      alert('Failed to import file. Check console for details.');
    }
  };

  reader.onerror = function() {
    console.error('Error reading file');
    alert('Error reading the file. Please try again.');
  };

  reader.readAsText(file);
}

function showDeleteModal() {
  console.log('Delete button clicked');
  if (currentTab === 'browser' || Object.keys(files).length <= 1) return;

  const fileName = files[currentTab].filename;
  document.getElementById('deleteFileMessage').textContent = `Are you sure you want to delete ${fileName}?`;
  document.getElementById('deleteFileModal').style.display = 'flex';
}

function closeDeleteModal() {
  console.log('Delete modal closed');
  document.getElementById('deleteFileModal').style.display = 'none';
}

function confirmDeleteFile() {
  console.log(`Confirming deletion of file: ${currentTab}`);
  try {
    if (currentTab === 'browser' || !files[currentTab]) {
      closeDeleteModal();
      return;
    }

    const tabButton = document.querySelector(`.tab[data-file-id="${currentTab}"]`);
    if (tabButton) tabButton.remove();

    const editorArea = document.getElementById(currentTab);
    if (editorArea) editorArea.remove();

    delete editors[currentTab];
    delete files[currentTab];

    if (currentTab === lastHtmlTab) {
      const htmlFiles = Object.keys(files).filter(id => files[id].type === 'html');
      lastHtmlTab = htmlFiles.length > 0 ? htmlFiles[0] : null;
    }

    const remainingTabs = Object.keys(files);
    const nextTab = remainingTabs.length > 0 ? remainingTabs[0] : 'browser';
    switchTab(nextTab);

    closeDeleteModal();
  } catch (error) {
    console.error('Error during file deletion:', error);
    alert('Failed to delete file. Check console for details.');
    closeDeleteModal();
  }
}

function showNewFileModal() {
  console.log('New button clicked');
  document.getElementById('newFileModal').style.display = 'flex';
  document.getElementById('newFileName').focus();
}

function closeNewFileModal() {
  console.log('New file modal closed');
  document.getElementById('newFileModal').style.display = 'none';
  document.getElementById('newFileName').value = '';
}

function createNewFile() {
  console.log('Create New File button clicked');
  try {
    const name = document.getElementById('newFileName').value.trim();
    const type = document.getElementById('fileType').value;
    if (!name) return alert('Please enter a file name.');

    const fileName = `${name}.${type}`;
    const fileId = `${type}-${name.replace(/\s+/g, '-')}`;
    if (files[fileId]) return alert('File already exists.');

    const tab = document.createElement('button');
    tab.className = 'tab';
    tab.textContent = fileName;
    tab.setAttribute('data-file-id', fileId);
    tab.onclick = () => switchTab(fileId);
    document.querySelector('.tabs').insertBefore(tab, document.querySelector('.tab[onclick="switchTab(\'browser\')"]'));

    const editorArea = document.createElement('div');
    editorArea.id = fileId;
    editorArea.className = 'editor-area';
    const textarea = document.createElement('textarea');
    textarea.id = `editor-${fileId}`;
    textarea.className = 'code-editor';
    textarea.value = type === 'html' ? '<!DOCTYPE html>\n<html>\n  <head>\n    <title>New Page</title>\n  </head>\n  <body>\n  </body>\n</html>' :
                     type === 'css' ? '/* New CSS File */\n' :
                     type === 'js' ? '/* New JS File */\n' :
                     type === 'jsx' ? 'import React from "react";\n\nfunction Component() {\n  return (\n    <div>\n      <h1>Hello, React!</h1>\n    </div>\n  );\n}\n\nexport default Component;\n' :
                     type === 'py' ? '# New Python File\n\nprint("Hello, Python!")\n' : '';
    editorArea.appendChild(textarea);
    document.querySelector('.container').appendChild(editorArea);

    files[fileId] = { type, content: textarea.value, filename: fileName };
    const mode = getModeForFileType(type);
    editors[fileId] = initializeCodeMirror(textarea, mode);

    closeNewFileModal();
    setTimeout(() => {
      switchTab(fileId);
      editors[fileId].refresh();
      editors[fileId].focus();
    }, 100);
  } catch (error) {
    console.error('Error creating new file:', error);
    alert('Failed to create new file. Check console for details.');
  }
}

function saveToFile() {
  console.log('Save button clicked');
  if (currentTab === 'browser') return;
  document.getElementById('saveFileName').value = files[currentTab].filename;
  document.getElementById('saveFileModal').style.display = 'flex';
  document.getElementById('saveFileName').focus();
}

function closeSaveFileModal() {
  console.log('Save file modal closed');
  document.getElementById('saveFileModal').style.display = 'none';
  document.getElementById('saveFileName').value = '';
}

function downloadFile() {
  console.log('Download button clicked');
  try {
    const fileName = document.getElementById('saveFileName').value.trim();
    if (!fileName) return alert('Please enter a file name.');

    if (editors[currentTab]) {
      files[currentTab].content = editors[currentTab].getValue();
    }

    const content = files[currentTab].content;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    files[currentTab].filename = fileName;
    const tabButton = document.querySelector(`.tab[data-file-id="${currentTab}"]`);
    if (tabButton) tabButton.textContent = fileName;

    closeSaveFileModal();
  } catch (error) {
    console.error('Error downloading file:', error);
    alert('Failed to download file. Check console for details.');
  }
}

function searchAndHighlight(findText) {
  if (currentTab === 'browser' || !editors[currentTab]) return;

  const editor = editors[currentTab];
 
  editor.getAllMarks().forEach(marker => marker.clear());
  searchMatches = [];
  currentMatchIndex = -1;

  if (!findText) return;

  const cursor = editor.getSearchCursor(findText, null, { caseSensitive: false });

  while (cursor.findNext()) {
    const marker = editor.markText(cursor.from(), cursor.to(), {
      className: 'highlight'
    });
    searchMatches.push({
      from: cursor.from(),
      to: cursor.to(),
      marker: marker
    });
  }

  if (searchMatches.length > 0) {
    currentMatchIndex = 0;
    editor.setSelection(searchMatches[currentMatchIndex].from, searchMatches[currentMatchIndex].to);
    editor.scrollIntoView({ line: searchMatches[currentMatchIndex].from.line, ch: 0 }, 200);
  }
}

function findAndReplace() {
  console.log('Find and Replace button clicked');
  if (currentTab === 'browser' || !editors[currentTab]) return;

  const findText = document.getElementById('findText').value;
  const replaceText = document.getElementById('replaceText').value;

  if (!findText) {
    alert('Please enter text to find.');
    return;
  }

  try {
    const editor = editors[currentTab];
    const content = editor.getValue();
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const newContent = content.replace(regex, replaceText);
    editor.setValue(newContent);
    files[currentTab].content = newContent;
    searchAndHighlight(findText);
  } catch (error) {
    console.error('Error in find and replace:', error);
    alert('Failed to perform find and replace. Check console for details.');
  }
}

function updateFindReplaceButton() {
  const findText = document.getElementById('findText').value;
  document.getElementById('findReplaceBtn').disabled = currentTab === 'browser' || !findText;
}

function navigateMatch(direction) {
  if (currentTab === 'browser' || !editors[currentTab] || searchMatches.length === 0) return;

  if (direction === 'next') {
    currentMatchIndex = (currentMatchIndex + 1) % searchMatches.length;
  } else if (direction === 'prev') {
    currentMatchIndex = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
  }

  const editor = editors[currentTab];
  editor.setSelection(searchMatches[currentMatchIndex].from, searchMatches[currentMatchIndex].to);
  editor.scrollIntoView({ line: searchMatches[currentMatchIndex].from.line, ch: 0 }, 200);
}

function showNewProjectModal() {
  console.log('Add Project button clicked');
  document.getElementById('newProjectModal').style.display = 'flex';
  document.getElementById('newProjectName').focus();
}

function closeNewProjectModal() {
  console.log('New project modal closed');
  document.getElementById('newProjectModal').style.display = 'none';
  document.getElementById('newProjectName').value = '';
}

function createNewProject() {
  console.log('Create New Project button clicked');
  try {
    const name = document.getElementById('newProjectName').value.trim();
    if (!name) return alert('Please enter a project name.');

    const projects = JSON.parse(localStorage.getItem('ideProjects') || '{}');
    if (projects[name]) return alert('Project already exists.');

    const projectId = `project-${Date.now()}`;
    projects[name] = { id: projectId, files: {}, currentTab: 'browser' };
    localStorage.setItem('ideProjects', JSON.stringify(projects));

    const projectList = document.getElementById('projectList');
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    projectList.appendChild(option);
    projectList.value = name;

    currentProject = name;
    document.getElementById('projectName').value = name;

    document.querySelectorAll('.tab:not([onclick="switchTab(\'browser\')"])').forEach(tab => tab.remove());
    document.querySelectorAll('.editor-area:not(#browser)').forEach(area => area.remove());
    files = {};
    editors = {};
    currentTab = 'browser';
    lastHtmlTab = null;
    switchTab('browser');

    closeNewProjectModal();
  } catch (error) {
    console.error('Error creating new project:', error);
    alert('Failed to create new project. Check console for details.');
  }
}

function saveProject() {
  console.log('Save Project button clicked');
  try {
    const name = document.getElementById('projectName').value.trim();
    if (!name) return alert('Please enter a project name.');

    if (currentTab !== 'browser' && editors[currentTab]) {
      files[currentTab].content = editors[currentTab].getValue();
    }

    const projects = JSON.parse(localStorage.getItem('ideProjects') || '{}');
    const projectId = `project-${Date.now()}`;
    projects[name] = { id: projectId, files: { ...files }, currentTab };
    localStorage.setItem('ideProjects', JSON.stringify(projects));

    if (!Object.keys(projects).includes(name)) {
      const projectList = document.getElementById('projectList');
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      projectList.appendChild(option);
    }

    document.getElementById('projectList').value = name;
    currentProject = name;
    alert('Project saved successfully.');
    updateButtonStates();
  } catch (error) {
    console.error('Error saving project:', error);
    alert('Failed to save project. Check console for details.');
  }
}

function openProject() {
  console.log('Open Project button clicked');
  try {
    const name = document.getElementById('projectList').value;
    if (!name) return;

    const projects = JSON.parse(localStorage.getItem('ideProjects') || '{}');
    const project = projects[name];
    if (!project) return alert('Project not found.');

    document.querySelectorAll('.tab:not([onclick="switchTab(\'browser\')"])').forEach(tab => tab.remove());
    document.querySelectorAll('.editor-area:not(#browser)').forEach(area => area.remove());
    files = {};
    editors = {};

    for (let fileId in project.files) {
      files[fileId] = project.files[fileId];

      const tab = document.createElement('button');
      tab.className = 'tab';
      tab.textContent = files[fileId].filename;
      tab.setAttribute('data-file-id', fileId);
      tab.onclick = () => switchTab(fileId);
      document.querySelector('.tabs').insertBefore(tab, document.querySelector('.tab[onclick="switchTab(\'browser\')"]'));

      const editorArea = document.createElement('div');
      editorArea.id = fileId;
      editorArea.className = 'editor-area';
      const textarea = document.createElement('textarea');
      textarea.id = `editor-${fileId}`;
      textarea.className = 'code-editor';
      textarea.value = files[fileId].content;
      editorArea.appendChild(textarea);
      document.querySelector('.container').appendChild(editorArea);

      const mode = getModeForFileType(files[fileId].type);
      editors[fileId] = initializeCodeMirror(textarea, mode);
    }

    currentProject = name;
    document.getElementById('projectName').value = name;
    currentTab = project.currentTab || 'browser';
    lastHtmlTab = Object.keys(files).find(id => files[id].type === 'html') || null;
    switchTab(currentTab);
  } catch (error) {
    console.error('Error opening project:', error);
    alert('Failed to open project. Check console for details.');
  }
}

function showDeleteProjectModal() {
  console.log('Delete Project button clicked');
  const projectName = document.getElementById('projectList').value;
  if (!projectName) return;
  document.getElementById('deleteProjectMessage').textContent = `Are you sure you want to delete the project "${projectName}"?`;
  document.getElementById('deleteProjectModal').style.display = 'flex';
}

function closeDeleteProjectModal() {
  console.log('Delete project modal closed');
  document.getElementById('deleteProjectModal').style.display = 'none';
}

function confirmDeleteProject() {
  console.log('Confirm Delete Project button clicked');
  try {
    const projectName = document.getElementById('projectList').value;
    if (!projectName) {
      closeDeleteProjectModal();
      return;
    }

    const projects = JSON.parse(localStorage.getItem('ideProjects') || '{}');
    delete projects[projectName];
    localStorage.setItem('ideProjects', JSON.stringify(projects));

    const projectList = document.getElementById('projectList');
    const option = projectList.querySelector(`option[value="${projectName}"]`);
    if (option) option.remove();

    if (currentProject === projectName) {
      currentProject = null;
      document.getElementById('projectName').value = '';
      document.querySelectorAll('.tab:not([onclick="switchTab(\'browser\')"])').forEach(tab => tab.remove());
      document.querySelectorAll('.editor-area:not(#browser)').forEach(area => area.remove());
      files = {};
      editors = {};
      currentTab = 'browser';
      lastHtmlTab = null;
      switchTab('browser');
    }

    closeDeleteProjectModal();
    updateButtonStates();
  } catch (error) {
    console.error('Error deleting project:', error);
    alert('Failed to delete project. Check console for details.');
    closeDeleteProjectModal();
  }
}

function loadProjects() {
  try {
    const projects = JSON.parse(localStorage.getItem('ideProjects') || '{}');
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = '<option value="">Select a Project</option>';
    for (let name in projects) {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      projectList.appendChild(option);
    }
    updateButtonStates();
  } catch (error) {
    console.error('Error loading projects:', error);
    alert('Failed to load projects. Check console for details.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  files['html-index'].content = document.getElementById('editor-html-index').value;
  files['css-style'].content = document.getElementById('editor-css-style').value;
  files['js-script'].content = document.getElementById('editor-js-script').value;

  const findTextInput = document.getElementById('findText');
  findTextInput.addEventListener('input', debounce(() => {
    const findText = findTextInput.value;
    searchAndHighlight(findText);
    updateFindReplaceButton();
  }, 300));

  document.getElementById('replaceText').addEventListener('input', updateFindReplaceButton);
  document.getElementById('fileInput').addEventListener('change', handleFileImport);

  document.querySelectorAll('.column button').forEach(button => {
    button.addEventListener('click', () => {
      console.log(`Button click: ${button.id}`);
    });
  });

  document.querySelectorAll('.modal-content button').forEach(button => {
    button.addEventListener('click', () => {
      console.log(`Modal button clicked: ${button.textContent}`);
    });
  });

  loadInitialFiles();

  window.onload = () => {
    console.log('Window loaded');
    if (currentTab === 'browser') runCode();
  };
});

const style = document.createElement('style');
style.textContent = `
  .highlight {
    background-color: #ffeb3b !important;
    color: #000 !important;
  }
`;
document.head.appendChild(style);
