/* Global state */
let files = {};
let currentFile = null;
let editor = null;
let pyodide = null;
let pyodideActive = false;
let pyodideInitialized = false;
let debounceTimeout = null;

/* Initialize Pyodide */
async function initializePyodide() {
  if (pyodideInitialized) return;
  try {
    pyodide = await loadPyodide();
    pyodideActive = true;
    pyodideInitialized = true;
    if (currentFile && currentFile.endsWith('.py')) {
      console.log('Pyodide initialized');
    }
  } catch (err) {
    console.error(`Error loading Pyodide: ${err.message}`);
  }
}
initializePyodide();

/* Initialize CodeMirror */
const editorTextArea = document.querySelector('.editor textarea');
editor = CodeMirror.fromTextArea(editorTextArea, {
  lineNumbers: true,
  theme: 'monokai',
  tabSize: 2,
  mode: 'text/plain',
  lineWrapping: true,
  matchBrackets: true,
  autoCloseBrackets: true,
  styleActiveLine: true,
  viewportMargin: Infinity
});

/* Ensure CodeMirror modes are loaded */
function loadCodeMirrorMode(mode, callback) {
  if (CodeMirror.modes[mode]) {
    callback();
  } else {
    console.warn(`Mode ${mode} not loaded, using text/plain`);
    editor.setOption('mode', 'text/plain');
  }
}

/* Load file into editor */
function loadFile(filename) {
  currentFile = filename;
  const modes = {
    html: 'htmlmixed',
    css: 'css',
    js: 'javascript',
    py: 'python',
    txt: 'text/plain'
  };
  const mode = modes[files[filename].type] || 'text/plain';
  loadCodeMirrorMode(mode, () => {
    editor.setOption('mode', mode);
    editor.setOption('theme', 'monokai');
    editor.setValue(files[filename].content || '');
    editor.refresh();
  });
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const tab = Array.from(document.querySelectorAll('.tab')).find(t => t.textContent.includes(filename));
  if (tab) tab.classList.add('active');
  updateStatusBar();
}

/* Initialize default files */
function initializeDefaultFiles() {
  files = {
    'index.html': {
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Webpage</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Welcome to My Webpage</h1>
  <script src="script.js"></script>
</body>
</html>`,
      type: 'html'
    },
    'styles.css': {
      content: `body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f0f0f0;
}

h1 {
  color: #333;
}`,
      type: 'css'
    },
    'script.js': {
      content: `console.log('Hello from script.js!');`,
      type: 'js'
    }
  };
  Object.keys(files).forEach(filename => {
    addTab(filename);
  });
  saveFilesToStorage();
  loadFile('index.html');
  console.log('Default files created: index.html, styles.css, script.js');
}

/* Load files from local storage */
function loadFilesFromStorage() {
  const storedFiles = localStorage.getItem('codeIDEFiles');
  if (storedFiles) {
    files = JSON.parse(storedFiles);
    if (Object.keys(files).length === 0) {
      // If no files exist in storage, initialize default files
      initializeDefaultFiles();
    } else {
      // Load existing files
      Object.keys(files).forEach(filename => {
        addTab(filename);
      });
      if (Object.keys(files).length > 0) {
        loadFile(Object.keys(files)[0]);
      }
    }
  } else {
    // If no stored files exist, initialize default files
    initializeDefaultFiles();
  }
}

/* Save files to local storage */
function saveFilesToStorage() {
  try {
    console.log('Saving files to localStorage:', files);
    localStorage.setItem('codeIDEFiles', JSON.stringify(files));
  } catch (err) {
    console.error('Error saving files to localStorage:', err.message);
  }
}

/* Validate JavaScript code */
function isValidJavaScript(code) {
  try {
    new Function(code);
    return true;
  } catch (err) {
    return false;
  }
}

/* Add tab */
function addTab(filename) {
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.innerHTML = `<i class="fa-solid fa-check" data-action="save"></i> ${filename} <i class="fa-solid fa-x" data-action="delete"></i>`;
  tab.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (action === 'save') {
      saveFile(filename);
    } else if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${filename}?`)) {
        deleteFile(filename);
      }
    } else {
      loadFile(filename);
    }
  });
  tabs.insertBefore(tab, document.querySelector('#add-file'));
}

/* Open output in new window */
function openOutputInNewWindow() {
  if (!currentFile || !currentFile.endsWith('.html')) {
    console.error('Error: Please select an HTML file to open output');
    return;
  }

  if (!files[currentFile] || !files[currentFile].content) {
    console.error(`Error: No content found for "${currentFile}"`);
    return;
  }

  const htmlContent = files[currentFile].content;
  const htmlFileName = currentFile;

  // Validate JavaScript files that might be linked
  const jsFiles = Object.keys(files).filter(f => f.endsWith('.js'));
  for (const jsFile of jsFiles) {
    if (!files[jsFile] || !files[jsFile].content) {
      console.error(`Error: File "${jsFile}" is empty or not found`);
      return;
    }
    if (!isValidJavaScript(files[jsFile].content)) {
      console.error(`Cannot open output: Invalid JavaScript in ${jsFile}`);
      return;
    }
  }

  try {
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      console.error('Error: Popup blocked. Please allow popups for this site.');
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Check for parsing errors
    if (doc.querySelector('parsererror')) {
      console.error(`Error: Invalid HTML in "${htmlFileName}"`);
      return;
    }

    // Process CSS: Remove <link> tags and embed content
    const cssLinks = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
    const embeddedCssFiles = [];
    cssLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && files[href] && files[href].content && href.endsWith('.css')) {
        const style = doc.createElement('style');
        style.textContent = `/* CSS from ${href} */\n${files[href].content}`;
        doc.head.appendChild(style);
        embeddedCssFiles.push(href);
        link.remove();
        console.log(`Embedded CSS: ${href}`);
      } else if (href && !files[href]) {
        console.warn(`Warning: CSS file "${href}" not found, link preserved`);
      }
    });

    // Process JavaScript: Remove <script src> tags and embed content
    const scriptTags = Array.from(doc.querySelectorAll('script[src]'));
    const embeddedJsFiles = [];
    scriptTags.forEach(script => {
      const src = script.getAttribute('src');
      if (src && files[src] && files[src].content && src.endsWith('.js')) {
        const newScript = doc.createElement('script');
        newScript.textContent = `
          // JavaScript from ${src}
          try {
            ${files[src].content}
          } catch (err) {
            console.error('Error in ${src}: ' + err.message);
          }
        `;
        doc.body.appendChild(newScript);
        embeddedJsFiles.push(src);
        script.remove();
        console.log(`Embedded JS: ${src}`);
      } else if (src && !files[src]) {
        console.warn(`Warning: JS file "${src}" not found, script tag preserved`);
      }
    });

    // Serialize the document
    const serializer = new XMLSerializer();
    const finalHtml = `<!DOCTYPE html>\n${serializer.serializeToString(doc)}`;

    // Write to the new window
    newWindow.document.write(finalHtml);
    newWindow.document.close();

    console.log(`Output opened for HTML: ${htmlFileName}, CSS: [${embeddedCssFiles.join(', ') || 'none'}], JS: [${embeddedJsFiles.join(', ') || 'none'}]`);
  } catch (err) {
    console.error(`Error opening output: ${err.message}`);
  }
}

/* Run Python code */
async function runPython(code) {
  if (!pyodideActive) {
    console.error('Error: Pyodide not initialized');
    return;
  }
  try {
    const result = await pyodide.runPythonAsync(code);
    if (result !== undefined) {
      console.log(String(result));
    }
  } catch (err) {
    console.error(`Python Error: ${err.message}`);
  }
}

/* Run editor code */
function runEditorCode() {
  console.log('runEditorCode called for file:', currentFile);
  if (!currentFile) {
    console.error('Error: No file selected');
    return;
  }
  const code = files[currentFile].content;
  if (!code.trim()) {
    console.log('Info: No code to run');
    return;
  }
  if (currentFile.endsWith('.py')) {
    console.log(`Running ${currentFile}...`);
    runPython(code);
  } else if (currentFile.endsWith('.js')) {
    if (!isValidJavaScript(code)) {
      console.error('Error: Invalid JavaScript code');
      return;
    }
    try {
      console.log(`Running ${currentFile}...`);
      const result = eval(code);
      console.log('Run complete');
    } catch (err) {
      console.error(`JavaScript Error: ${err.message}`);
    }
  } else {
    console.log(`Info: Auto-run skipped for non-JavaScript/Python file (${currentFile})`);
  }
}

/* Delete file */
function deleteFile(filename) {
  if (files[filename]) {
    delete files[filename];
    document.querySelectorAll(`.tabs .tab`).forEach(tab => {
      if (tab.textContent.includes(filename)) tab.remove();
    });
    if (currentFile === filename) {
      editor.setValue('');
      currentFile = null;
      updateStatusBar();
    }
    saveFilesToStorage();
    console.log(`File "${filename}" deleted successfully`);
    if (Object.keys(files).length === 0) {
      initializeDefaultFiles();
    }
  }
}

/* Save file */
function saveFile(filename) {
  if (filename && files[filename]) {
    files[filename].content = editor.getValue();
    const blob = new Blob([files[filename].content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    saveFilesToStorage();
    console.log(`File "${filename}" saved successfully`);
  } else {
    console.error('Error: No file selected');
  }
}

/* Update status bar */
function updateStatusBar() {
  const { line, ch } = editor.getCursor();
  document.querySelector('.status-bar span:first-child').textContent = `Ln ${line + 1}, Col ${ch + 1}`;
  document.querySelector('.status-bar span:last-child').textContent = `UTF-8 | ${files[currentFile]?.type || 'None'} | Spaces: 2`;
}

/* Clear editor code */
function clearEditorCode() {
  if (!currentFile) {
    console.error('Error: No file selected');
    return;
  }
  if (confirm(`Are you sure you want to clear the code in ${currentFile}?`)) {
    files[currentFile].content = '';
    editor.setValue('');
    saveFilesToStorage();
    console.log(`Code in "${currentFile}" cleared successfully`);
  }
}

/* Clear code button */
const clearCodeBtn = document.querySelector('#clear-code');
clearCodeBtn.addEventListener('click', clearEditorCode);

/* Download all files as ZIP */
function downloadAllFiles() {
  if (Object.keys(files).length === 0) {
    console.error('Error: No files to download');
    return;
  }
  if (confirm('Are you sure you want to download all files as a ZIP?')) {
    const zip = new JSZip();
    Object.keys(files).forEach(filename => {
      zip.file(filename, files[filename].content);
    });
    zip.generateAsync({ type: 'blob' }).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project-files.zip';
      a.click();
      URL.revokeObjectURL(url);
      console.log('All files downloaded as project-files.zip');
    }).catch(err => {
      console.error(`Error creating ZIP: ${err.message}`);
    });
  }
}

/* Download all files button */
const downloadAllBtn = document.querySelector('#download-all');
downloadAllBtn.addEventListener('click', downloadAllFiles);

/* Copy current file content to clipboard */
function copyFileContent() {
  if (!currentFile) {
    console.error('Error: No file selected to copy');
    return;
  }
  const content = files[currentFile].content || '';
  navigator.clipboard.writeText(content).then(() => {
    console.log(`Copied content of "${currentFile}" to clipboard`);
  }).catch(err => {
    console.error(`Error copying content: ${err.message}`);
  });
}

/* Copy code button */
const copyCodeBtn = document.querySelector('#copy-code');
copyCodeBtn.addEventListener('click', copyFileContent);

/* DOM elements */
const tabs = document.querySelector('.tabs');
const addFileBtn = document.querySelector('#add-file');
const fileInput = document.querySelector('#file-import');
const fileModal = document.querySelector('#file-modal');
const createNewFileBtn = document.querySelector('#create-new-file');
const cancelModalBtn = document.querySelector('#cancel-modal');
const newFileNameInput = document.querySelector('#new-file-name');
const openOutputBtn = document.querySelector('#open-output');
const runCodeBtn = document.querySelector('#run-code');

/* Show file modal */
addFileBtn.addEventListener('click', () => {
  fileModal.style.display = 'flex';
});

/* Create new file */
createNewFileBtn.addEventListener('click', () => {
  const filename = newFileNameInput.value.trim();
  if (!filename) {
    console.error('Error: Filename cannot be empty');
    return;
  }
  if (files[filename]) {
    console.error(`Error: File "${filename}" already exists`);
    return;
  }
  const ext = filename.split('.').pop().toLowerCase();
  if (!['html', 'css', 'js', 'py', 'txt'].includes(ext)) {
    console.error(`Error: Unsupported file type ".${ext}"`);
    return;
  }
  files[filename] = { content: '', type: ext };
  addTab(filename);
  loadFile(filename);
  saveFilesToStorage();
  fileModal.style.display = 'none';
  newFileNameInput.value = '';
  console.log(`File "${filename}" created and saved successfully`);
});

/* Cancel modal */
cancelModalBtn.addEventListener('click', () => {
  fileModal.style.display = 'none';
  newFileNameInput.value = '';
});

/* File import */
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) {
    console.error('Error: No file selected');
    return;
  }
  const filename = file.name;
  const ext = filename.split('.').pop().toLowerCase();
  if (!['html', 'css', 'js', 'py', 'txt'].includes(ext)) {
    console.error(`Error: Unsupported file type ".${ext}"`);
    return;
  }
  if (files[filename]) {
    console.error(`Error: File "${filename}" already exists`);
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      files[filename] = { content: e.target.result, type: ext };
      addTab(filename);
      loadFile(filename);
      saveFilesToStorage();
      fileModal.style.display = 'none';
      console.log(`File "${filename}" imported successfully`);
    } catch (err) {
      console.error(`Error importing file: ${err.message}`);
    }
    e.target.value = '';
  };
  reader.onerror = () => {
    console.error('Error: Failed to read file');
    e.target.value = '';
  };
  reader.readAsText(file);
});

/* Editor changes */
editor.on('change', () => {
  console.log('Editor change detected, currentFile:', currentFile);
  if (currentFile && files[currentFile]) {
    files[currentFile].content = editor.getValue();
    saveFilesToStorage();
  } else {
    console.warn('No current file selected, skipping save');
  }
});

/* Cursor tracking */
editor.on('cursorActivity', updateStatusBar);

/* Open output in new window button */
openOutputBtn.addEventListener('click', openOutputInNewWindow);

/* Run code button */
runCodeBtn.addEventListener('click', () => {
  console.log('Run button clicked');
  runEditorCode();
});

/* Initialize files from local storage */
loadFilesFromStorage();
