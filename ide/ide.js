// Initialize CodeMirror editors
const editors = {};
document.querySelectorAll('.code-editor').forEach((textarea) => {
  const editor = CodeMirror.fromTextArea(textarea, {
    lineNumbers: true,
    mode: 'htmlmixed',
    theme: 'monokai',
    tabSize: 2,
    lineWrapping: true,
    extraKeys: {
      'Ctrl-S': saveToFile,
      'Cmd-S': saveToFile
    }
  });
  editors[textarea.id] = editor;

  // Set mode based on textarea id
  if (textarea.id.includes('html')) {
    editor.setOption('mode', 'htmlmixed');
  } else if (textarea.id.includes('css')) {
    editor.setOption('mode', 'css');
  } else if (textarea.id.includes('js') || textarea.id.includes('jsx')) {
    editor.setOption('mode', 'javascript');
  } else if (textarea.id.includes('py')) {
    editor.setOption('mode', 'python');
  }

  // Update preview on change
  editor.on('change', updatePreview);
});

// Initial preview update
updatePreview();

// Tab switching
let activeTab = 'html-index';
function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.editor-area').forEach(area => area.classList.remove('visible'));

  const tabButton = document.querySelector(`.tab[data-file-id="${tabId}"], .tab[onclick="switchTab('${tabId}')"]`);
  if (tabButton) tabButton.classList.add('active');

  const area = document.getElementById(tabId);
  if (area) area.classList.add('visible');

  activeTab = tabId;

  if (tabId !== 'browser') {
    editors[`editor-${tabId}`].refresh();
    editors[`editor-${tabId}`].focus();
  }
}

// Update preview
function updatePreview() {
  const htmlContent = editors['editor-html-index'].getValue();
  const cssContent = `<style>${editors['editor-css-style'].getValue()}</style>`;
  const jsContent = `<script>${editors['editor-js-script'].getValue()}</script>`;
  const fullContent = `${htmlContent.replace('</head>', `${cssContent}</head>`).replace('</body>', `${jsContent}</body>`)}`;

  const iframe = document.getElementById('preview');
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(fullContent);
  iframeDoc.close();
}

// File operations
function showNewFileModal() {
  document.getElementById('newFileModal').style.display = 'flex';
}

function closeNewFileModal() {
  document.getElementById('newFileModal').style.display = 'none';
  document.getElementById('newFileName').value = '';
}

function createNewFile() {
  const fileName = document.getElementById('newFileName').value.trim();
  const fileType = document.getElementById('fileType').value;

  if (!fileName) {
    alert('Please enter a file name.');
    return;
  }

  const tabId = `${fileType}-${fileName.replace(/\./g, '-')}`;
  if (document.getElementById(tabId)) {
    alert('File already exists.');
    return;
  }

  const tabButton = document.createElement('button');
  tabButton.className = 'tab';
  tabButton.setAttribute('data-file-id', tabId);
  tabButton.setAttribute('onclick', `switchTab('${tabId}')`);
  tabButton.textContent = fileName;
  document.querySelector('.tabs').insertBefore(tabButton, document.querySelector('.tabs .tab:last-child'));

  const editorArea = document.createElement('div');
  editorArea.id = tabId;
  editorArea.className = 'editor-area';
  const textarea = document.createElement('textarea');
  textarea.id = `editor-${tabId}`;
  textarea.className = 'code-editor';
  editorArea.appendChild(textarea);
  document.querySelector('.container').appendChild(editorArea);

  const editor = CodeMirror.fromTextArea(textarea, {
    lineNumbers: true,
    mode: fileType === 'html' ? 'htmlmixed' : fileType,
    theme: 'monokai',
    tabSize: 2,
    lineWrapping: true,
    extraKeys: {
      'Ctrl-S': saveToFile,
      'Cmd-S': saveToFile
    }
  });
  editors[`editor-${tabId}`] = editor;
  editor.on('change', updatePreview);

  closeNewFileModal();
  switchTab(tabId);
}

function triggerFileInput() {
  document.getElementById('fileInput').click();
}

document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const fileName = file.name;
  const fileType = fileName.split('.').pop().toLowerCase();
  const tabId = `${fileType}-${fileName.replace(/\./g, '-')}`;

  if (document.getElementById(tabId)) {
    alert('File already exists.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const tabButton = document.createElement('button');
    tabButton.className = 'tab';
    tabButton.setAttribute('data-file-id', tabId);
    tabButton.setAttribute('onclick', `switchTab('${tabId}')`);
    tabButton.textContent = fileName;
    document.querySelector('.tabs').insertBefore(tabButton, document.querySelector('.tabs .tab:last-child'));

    const editorArea = document.createElement('div');
    editorArea.id = tabId;
    editorArea.className = 'editor-area';
    const textarea = document.createElement('textarea');
    textarea.id = `editor-${tabId}`;
    textarea.className = 'code-editor';
    textarea.value = e.target.result;
    editorArea.appendChild(textarea);
    document.querySelector('.container').appendChild(editorArea);

    const editor = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      mode: fileType === 'html' ? 'htmlmixed' : fileType,
      theme: 'monokai',
      tabSize: 2,
      lineWrapping: true,
      extraKeys: {
        'Ctrl-S': saveToFile,
        'Cmd-S': saveToFile
      }
    });
    editors[`editor-${tabId}`] = editor;
    editor.on('change', updatePreview);

    switchTab(tabId);
  };
  reader.readAsText(file);
});

function saveToFile() {
  if (activeTab === 'browser') {
    alert('Please select a file tab to save.');
    return;
  }

  const editor = editors[`editor-${activeTab}`];
  const content = editor.getValue();
  const tabButton = document.querySelector(`.tab[data-file-id="${activeTab}"]`);
  const fileName = tabButton.textContent;

  document.getElementById('saveFileName').value = fileName;
  document.getElementById('saveFileModal').style.display = 'flex';
}

function closeSaveFileModal() {
  document.getElementById('saveFileModal').style.display = 'none';
  document.getElementById('saveFileName').value = '';
}

function downloadFile() {
  const fileName = document.getElementById('saveFileName').value.trim();
  if (!fileName) {
    alert('Please enter a file name.');
    return;
  }

  const editor = editors[`editor-${activeTab}`];
  const content = editor.getValue();
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
  closeSaveFileModal();
}

function showDeleteModal() {
  if (activeTab === 'browser' || activeTab === 'html-index' || activeTab === 'css-style' || activeTab === 'js-script') {
    alert('Cannot delete this tab.');
    return;
  }

  const tabButton = document.querySelector(`.tab[data-file-id="${activeTab}"]`);
  document.getElementById('deleteFileMessage').textContent = `Are you sure you want to delete ${tabButton.textContent}?`;
  document.getElementById('deleteFileModal').style.display = 'flex';
}

function closeDeleteModal() {
  document.getElementById('deleteFileModal').style.display = 'none';
}

function confirmDeleteFile() {
  const tabButton = document.querySelector(`.tab[data-file-id="${activeTab}"]`);
  const editorArea = document.getElementById(activeTab);
  tabButton.remove();
  editorArea.remove();
  delete editors[`editor-${activeTab}`];
  switchTab('html-index');
  closeDeleteModal();
}

function selectAllCode() {
  if (activeTab === 'browser') {
    alert('Please select a file tab to select code.');
    return;
  }

  const editor = editors[`editor-${activeTab}`];
  editor.execCommand('selectAll');
  editor.focus();
}

function findAndReplace() {
  if (activeTab === 'browser') {
    alert('Please select a file tab to perform find and replace.');
    return;
  }

  const findText = document.getElementById('findText').value;
  const replaceText = document.getElementById('replaceText').value;
  if (!findText) {
    alert('Please enter text to find.');
    return;
  }

  const editor = editors[`editor-${activeTab}`];
  let content = editor.getValue();
  const regex = new RegExp(findText, 'g');
  content = content.replace(regex, replaceText);
  editor.setValue(content);
  updatePreview();
}

// Project operations
function showNewProjectModal() {
  document.getElementById('newProjectModal').style.display = 'flex';
}

function closeNewProjectModal() {
  document.getElementById('newProjectModal').style.display = 'none';
  document.getElementById('newProjectName').value = '';
}

function createNewProject() {
  const projectName = document.getElementById('newProjectName').value.trim();
  if (!projectName) {
    alert('Please enter a project name.');
    return;
  }

  const projectList = document.getElementById('projectList');
  if (Array.from(projectList.options).some(option => option.value === projectName)) {
    alert('Project already exists.');
    return;
  }

  const option = document.createElement('option');
  option.value = projectName;
  option.textContent = projectName;
  projectList.appendChild(option);
  projectList.value = projectName;
  document.getElementById('projectName').value = projectName;

  // Enable buttons
  document.getElementById('saveProjectBtn').disabled = false;
  document.getElementById('openProjectBtn').disabled = false;
  document.getElementById('deleteProjectBtn').disabled = false;
  document.getElementById('exportProjectBtn').disabled = false;

  closeNewProjectModal();
}

function saveProject() {
  const projectName = document.getElementById('projectName').value.trim();
  if (!projectName) {
    alert('Please enter a project name.');
    return;
  }

  const files = {};
  Object.keys(editors).forEach(editorId => {
    const tabId = editorId.replace('editor-', '');
    const tabButton = document.querySelector(`.tab[data-file-id="${tabId}"]`);
    if (tabButton) {
      const fileName = tabButton.textContent;
      files[fileName] = editors[editorId].getValue();
    }
  });

  const projectData = { files };
  localStorage.setItem(`project-${projectName}`, JSON.stringify(projectData));
  alert('Project saved successfully.');
}

function openProject() {
  const projectName = document.getElementById('projectList').value;
  if (!projectName) {
    alert('Please select a project to open.');
    return;
  }

  const projectData = JSON.parse(localStorage.getItem(`project-${projectName}`));
  if (!projectData) {
    alert('Project not found.');
    return;
  }

  // Clear existing tabs and editors except default ones
  document.querySelectorAll('.tab[data-file-id]').forEach(tab => {
    const tabId = tab.getAttribute('data-file-id');
    if (!['html-index', 'css-style', 'js-script'].includes(tabId)) {
      tab.remove();
      document.getElementById(tabId).remove();
      delete editors[`editor-${tabId}`];
    }
  });

  // Reset default editors
  editors['editor-html-index'].setValue('<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n    <link rel="stylesheet" href="style.css">\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n    <p id="demo">This is a demo.</p>\n    <script src="script.js"></script>\n  </body>\n</html>');
  editors['editor-css-style'].setValue('body {\n  background-color: #f0f0f0;\n  font-family: Arial, sans-serif;\n}\n\nh1 {\n  color: #333;\n}\n\np {\n  color: #666;\n}');
  editors['editor-js-script'].setValue('document.getElementById("demo").innerHTML = "Hello from JavaScript!";\nconsole.log("Script loaded.");');

  // Load project files
  Object.entries(projectData.files).forEach(([fileName, content]) => {
    const fileType = fileName.split('.').pop().toLowerCase();
    const tabId = `${fileType}-${fileName.replace(/\./g, '-')}`;

    if (['html-index', 'css-style', 'js-script'].includes(tabId)) {
      editors[`editor-${tabId}`].setValue(content);
    } else {
      const tabButton = document.createElement('button');
      tabButton.className = 'tab';
      tabButton.setAttribute('data-file-id', tabId);
      tabButton.setAttribute('onclick', `switchTab('${tabId}')`);
      tabButton.textContent = fileName;
      document.querySelector('.tabs').insertBefore(tabButton, document.querySelector('.tabs .tab:last-child'));

      const editorArea = document.createElement('div');
      editorArea.id = tabId;
      editorArea.className = 'editor-area';
      const textarea = document.createElement('textarea');
      textarea.id = `editor-${tabId}`;
      textarea.className = 'code-editor';
      textarea.value = content;
      editorArea.appendChild(textarea);
      document.querySelector('.container').appendChild(editorArea);

      const editor = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true,
        mode: fileType === 'html' ? 'htmlmixed' : fileType,
        theme: 'monokai',
        tabSize: 2,
        lineWrapping: true,
        extraKeys: {
          'Ctrl-S': saveToFile,
          'Cmd-S': saveToFile
        }
      });
      editors[`editor-${tabId}`] = editor;
      editor.on('change', updatePreview);
    }
  });

  document.getElementById('projectName').value = projectName;
  switchTab('html-index');
  updatePreview();
}

function showDeleteProjectModal() {
  const projectName = document.getElementById('projectList').value;
  if (!projectName) {
    alert('Please select a project to delete.');
    return;
  }

  document.getElementById('deleteProjectMessage').textContent = `Are you sure you want to delete the project "${projectName}"?`;
  document.getElementById('deleteProjectModal').style.display = 'flex';
}

function closeDeleteProjectModal() {
  document.getElementById('deleteProjectModal').style.display = 'none';
}

function confirmDeleteProject() {
  const projectName = document.getElementById('projectList').value;
  localStorage.removeItem(`project-${projectName}`);
  const projectList = document.getElementById('projectList');
  projectList.remove(projectList.selectedIndex);
  projectList.value = '';
  document.getElementById('projectName').value = '';

  // Disable buttons
  document.getElementById('saveProjectBtn').disabled = true;
  document.getElementById('openProjectBtn').disabled = true;
  document.getElementById('deleteProjectBtn').disabled = true;
  document.getElementById('exportProjectBtn').disabled = true;

  // Reset to default state
  switchTab('html-index');
  editors['editor-html-index'].setValue('<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n    <link rel="stylesheet" href="style.css">\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n    <p id="demo">This is a demo.</p>\n    <script src="script.js"></script>\n  </body>\n</html>');
  editors['editor-css-style'].setValue('body {\n  background-color: #f0f0f0;\n  font-family: Arial, sans-serif;\n}\n\nh1 {\n  color: #333;\n}\n\np {\n  color: #666;\n}');
  editors['editor-js-script'].setValue('document.getElementById("demo").innerHTML = "Hello from JavaScript!";\nconsole.log("Script loaded.");');
  updatePreview();
  closeDeleteProjectModal();
}

// Export project as ZIP
function exportProject() {
  const projectName = document.getElementById('projectList').value;
  if (!projectName) {
    alert('Please select a project to export.');
    return;
  }

  const projectData = JSON.parse(localStorage.getItem(`project-${projectName}`));
  if (!projectData) {
    alert('Project not found.');
    return;
  }

  const zip = new JSZip();
  Object.entries(projectData.files).forEach(([fileName, content]) => {
    zip.file(fileName, content);
  });

  zip.generateAsync({ type: 'blob' }).then((content) => {
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

// Load existing projects
document.addEventListener('DOMContentLoaded', () => {
  const projectList = document.getElementById('projectList');
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('project-')) {
      const projectName = key.replace('project-', '');
      const option = document.createElement('option');
      option.value = projectName;
      option.textContent = projectName;
      projectList.appendChild(option);
    }
  });

  // Initially disable buttons
  document.getElementById('saveProjectBtn').disabled = true;
  document.getElementById('openProjectBtn').disabled = true;
  document.getElementById('deleteProjectBtn').disabled = true;
  document.getElementById('exportProjectBtn').disabled = true;
});
