// Global state
let files = {};
let currentFile = null;
let editor = null;
let pyodide = null;
let pyodideReady = false;

// Initialize Pyodide
async function loadPyodideAndRun() {
  try {
    pyodide = await loadPyodide();
    pyodideReady = true;
    const outputDiv = document.createElement('div');
    outputDiv.textContent = 'Pyodide loaded';
    document.querySelector('.console').insertBefore(outputDiv, document.querySelector('.console input'));
  } catch (err) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = `Failed to load Pyodide: ${err.message}`;
    errorDiv.style.color = 'red';
    document.querySelector('.console').insertBefore(errorDiv, document.querySelector('.console input'));
  }
}
loadPyodideAndRun();

// Initialize CodeMirror
const textarea = document.querySelector('.editor textarea');
editor = CodeMirror.fromTextArea(textarea, {
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

// Ensure CodeMirror modes are loaded
function loadCodeMirrorMode(mode, callback) {
  if (CodeMirror.modes[mode]) {
    callback();
  } else {
    console.warn(`Mode ${mode} not loaded, using text/plain`);
    editor.setOption('mode', 'text/plain');
  }
}

// Load file into editor
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
  updateOutput();
  updateStatusBar();
}

// Load files from local storage
function loadFilesFromStorage() {
  const storedFiles = localStorage.getItem('codeIDEFiles');
  if (storedFiles) {
    files = JSON.parse(storedFiles);
    Object.keys(files).forEach(filename => {
      addTab(filename);
    });
    if (Object.keys(files).length > 0) {
      loadFile(Object.keys(files)[0]);
    }
  }
}

// Save files to local storage
function saveFilesToStorage() {
  localStorage.setItem('codeIDEFiles', JSON.stringify(files));
}

// Validate JavaScript code
function isValidJavaScript(code) {
  try {
    new Function(code);
    return true;
  } catch (err) {
    return false;
  }
}

// Add tab
function addTab(filename) {
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.innerHTML = `<i class="fa-solid fa-check" data-action="save"></i> ${filename} <i class="fa-solid fa-xmark" data-action="delete"></i>`;
  tab.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'save') {
      saveFile(filename);
    } else if (e.target.dataset.action === 'delete') {
      if (confirm(`Are you sure you want to delete ${filename}?`)) {
        deleteFile(filename);
      }
    } else {
      loadFile(filename);
    }
  });
  tabs.insertBefore(tab, document.querySelector('#add-file'));
}

// Update output
function updateOutput() {
  const htmlFile = Object.keys(files).find(f => f.endsWith('.html'));
  const cssFile = Object.keys(files).find(f => f.endsWith('.css'));
  const jsFile = Object.keys(files).find(f => f.endsWith('.js'));
  const html = files[htmlFile]?.content || '';
  const css = files[cssFile]?.content || '';
  const js = files[jsFile]?.content || '';
  
  if (js && !isValidJavaScript(js)) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Error: Invalid JavaScript in output';
    errorDiv.style.color = 'red';
    document.querySelector('.console').insertBefore(errorDiv, document.querySelector('.console input'));
    document.querySelector('.output iframe').srcdoc = '<h1>Invalid JavaScript</h1>';
    return;
  }

  const doc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>${html}<script>${js}</script></body>
    </html>`;
  document.querySelector('.output iframe').srcdoc = doc;
}

// Open output in new window
function openOutputInNewWindow() {
  const htmlFile = Object.keys(files).find(f => f.endsWith('.html'));
  const cssFile = Object.keys(files).find(f => f.endsWith('.css'));
  const jsFile = Object.keys(files).find(f => f.endsWith('.js'));
  const html = files[htmlFile]?.content || '';
  const css = files[cssFile]?.content || '';
  const js = files[jsFile]?.content || '';

  if (js && !isValidJavaScript(js)) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Cannot open output: Invalid JavaScript';
    errorDiv.style.color = 'red';
    document.querySelector('.console').insertBefore(errorDiv, document.querySelector('.console input'));
    return;
  }

  try {
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'Error: Popup blocked. Please allow popups for this site.';
      errorDiv.style.color = 'red';
      document.querySelector('.console').insertBefore(errorDiv, document.querySelector('.console input'));
      return;
    }
    const doc = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Output Preview</title>
          <style>${css}</style>
        </head>
        <body>${html}<script>${js}</script></body>
      </html>`;
    newWindow.document.write(doc);
    newWindow.document.close();
  } catch (err) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = `Error opening new window: ${err.message}`;
    errorDiv.style.color = 'red';
    document.querySelector('.console').insertBefore(errorDiv, document.querySelector('.console input'));
  }
}

// Run Python code
async function runPython(code) {
  if (!pyodideReady) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Error: Pyodide not loaded yet';
    errorDiv.style.color = 'red';
    document.querySelector('.console').insertBefore(errorDiv, document.querySelector('.console input'));
    return;
  }
  try {
    const output = await pyodide.runPythonAsync(code);
    const outputDiv = document.createElement('div');
    outputDiv.textContent = output !== undefined ? String(output) : '';
    document.querySelector('.console').insertBefore(outputDiv, document.querySelector('.console input'));
  } catch (err) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = `Python Error: ${err.message}`;
    errorDiv.style.color = 'red';
    document.querySelector('.console').insertBefore(errorDiv, document.querySelector('.console input'));
  }
  document.querySelector('.console').scrollTop = document.querySelector('.console').scrollHeight;
}

// Delete file
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
    updateOutput();
  }
}

// Save file
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
    alert('File saved');
  } else {
    alert('No file selected');
  }
}

// Update status bar
function updateStatusBar() {
  const { line, ch } = editor.getCursor();
  document.querySelector('.status-bar span:first-child').textContent = `Ln ${line + 1}, Col ${ch + 1}`;
  document.querySelector('.status-bar span:last-child').textContent = `UTF-8 | ${files[currentFile]?.type || 'None'} | Spaces: 2`;
}

// DOM elements
const tabs = document.querySelector('.tabs');
const outputFrame = document.querySelector('.output iframe');
const consoleInput = document.querySelector('.console input');
const addFileBtn = document.querySelector('#add-file');
const fileInput = document.querySelector('#file-import');
const fileModal = document.querySelector('#file-modal');
const createNewFileBtn = document.querySelector('#create-new-file');
const cancelModalBtn = document.querySelector('#cancel-modal');
const newFileNameInput = document.querySelector('#new-file-name');
const openOutputBtn = document.querySelector('#open-output');

// Show file modal
addFileBtn.addEventListener('click', () => {
  fileModal.style.display = 'flex';
});

// Create new file
createNewFileBtn.addEventListener('click', () => {
  const filename = newFileNameInput.value.trim();
  if (!filename) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Error: Filename cannot be empty';
    errorDiv.style.color = 'red';
    document.querySelector('.console').insertBefore(errorDiv, consoleInput);
    return;
  }
  if (files[filename]) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = `Error: File "${filename}" already exists`;
    errorDiv.style.color = 'red';
    document.querySelector('.console').insertBefore(errorDiv, consoleInput);
    return;
  }
  const ext = filename.split('.').pop().toLowerCase();
  if (!['html', 'css', 'js', 'py', 'txt'].includes(ext)) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = `Error: Unsupported file type ".${ext}"`;
    errorDiv.style.color = 'red';
    document.querySelector('.console').insertBefore(errorDiv, consoleInput);
    return;
  }
  files[filename] = { content: '', type: ext };
  addTab(filename);
  loadFile(filename);
  saveFilesToStorage();
  fileModal.style.display = 'none';
  newFileNameInput.value = '';
  const successDiv = document.createElement('div');
  successDiv.textContent = `File "${filename}" created successfully`;
  document.querySelector('.console').insertBefore(successDiv, consoleInput);
});

// Cancel modal
cancelModalBtn.addEventListener('click', () => {
  fileModal.style.display = 'none';
  newFileNameInput.value = '';
});

// File import
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Error: No file selected';
    errorDiv.style.color = 'red';
    document.querySelector('.console').insertBefore(errorDiv, consoleInput);
    return;
  }
  const filename = file.name;
  const ext = filename.split('.').pop().toLowerCase();
  if (!['html', 'css', 'js', 'py', 'txt'].includes(ext)) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = `Error: Unsupported file type ".${ext}"`;
    errorDiv.style.color = 'red';
    document.querySelector('.console').insertBefore(errorDiv, consoleInput);
    e.target.value = '';
    return;
  }
  if (files[filename]) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = `Error: File "${filename}" already exists`;
    errorDiv.style.color = 'red';
    document.querySelector('.console').insertBefore(errorDiv, consoleInput);
    e.target.value = '';
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
      const successDiv = document.createElement('div');
      successDiv.textContent = `File "${filename}" imported successfully`;
      document.querySelector('.console').insertBefore(successDiv, consoleInput);
    } catch (err) {
      const errorDiv = document.createElement('div');
      errorDiv.textContent = `Error importing file: ${err.message}`;
      errorDiv.style.color = 'red';
      document.querySelector('.console').insertBefore(errorDiv, consoleInput);
    }
    e.target.value = '';
  };
  reader.onerror = () => {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Error: Failed to read file';
    errorDiv.style.color = 'red';
    document.querySelector('.console').insertBefore(errorDiv, consoleInput);
    e.target.value = '';
  };
  reader.readAsText(file);
});

// Editor changes
editor.on('change', () => {
  if (currentFile && files[currentFile]) {
    files[currentFile].content = editor.getValue();
    saveFilesToStorage();
    if (currentFile.endsWith('.html') || currentFile.endsWith('.css') || currentFile.endsWith('.js')) {
      updateOutput();
    }
  }
});

// Cursor tracking
editor.on('cursorActivity', updateStatusBar);

// Console input
consoleInput.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    const command = e.target.value.trim();
    if (!command) return;
    const outputDiv = document.createElement('div');
    outputDiv.textContent = `> ${command}`;
    document.querySelector('.console').insertBefore(outputDiv, e.target);
    try {
      if (currentFile && currentFile.endsWith('.js') && isValidJavaScript(command)) {
        const result = eval(command);
        const resultDiv = document.createElement('div');
        resultDiv.textContent = result !== undefined ? String(result) : '';
        document.querySelector('.console').insertBefore(resultDiv, e.target);
      } else if (currentFile && currentFile.endsWith('.py')) {
        await runPython(command);
      } else {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Error: No valid file context or invalid command';
        errorDiv.style.color = 'red';
        document.querySelector('.console').insertBefore(errorDiv, e.target);
      }
    } catch (err) {
      const errorDiv = document.createElement('div');
      errorDiv.textContent = `JavaScript Error: ${err.message}`;
      errorDiv.style.color = 'red';
      document.querySelector('.console').insertBefore(errorDiv, e.target);
    }
    e.target.value = '';
    document.querySelector('.console').scrollTop = document.querySelector('.console').scrollHeight;
  }
});

// Open output in new window button
openOutputBtn.addEventListener('click', openOutputInNewWindow);

// Initialize files from local storage
loadFilesFromStorage();
