/* Global state */
let files = {};
let currentFile = null;
let editor = null;
let pyodide = null;
let pyodideActive = false;
let pyodideInitialized = false; // New flag to track Pyodide initialization
let consoleWindow = null;
let debounceTimeout = null;
let consoleMessageQueue = [];

/* Initialize Pyodide */
async function initializePyodide() {
  if (pyodideInitialized) return; // Prevent multiple initializations
  try {
    pyodide = await loadPyodide();
    pyodideActive = true;
    pyodideInitialized = true;
    appendToConsole('Pyodide initialized', 'green');
  } catch (err) {
    appendToConsole(`Error loading Pyodide: ${err.message}`, 'red');
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

/* Load files from local storage */
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

/* Save files to local storage */
function saveFilesToStorage() {
  localStorage.setItem('codeIDEFiles', JSON.stringify(files));
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
  tab.innerHTML = ` ${filename} `;
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

/* Open output in new window */
function openOutputInNewWindow() {
  const htmlFile = Object.keys(files).find(f => f.endsWith('.html'));
  const cssFile = Object.keys(files).find(f => f.endsWith('.css'));
  const jsFile = Object.keys(files).find(f => f.endsWith('.js'));
  const html = files[htmlFile]?.content || '';
  const css = files[cssFile]?.content || '';
  const js = files[jsFile]?.content || '';

  if (js && !isValidJavaScript(js)) {
    appendToConsole('Cannot open output: Invalid JavaScript', 'red');
    return;
  }

  try {
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      appendToConsole('Error: Popup blocked. Please allow popups for this site.', 'red');
      return;
    }
    const doc = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
      </html>
    `;
    newWindow.document.write(doc);
    newWindow.document.close();
  } catch (err) {
    appendToConsole(`Error opening new window: ${err.message}`, 'red');
  }
}

/* Append message to console window or fallback */
function appendToConsole(message, color = 'white') {
  if (consoleWindow && !consoleWindow.closed) {
    const outputDiv = consoleWindow.document.createElement('div');
    outputDiv.textContent = message;
    outputDiv.style.color = color;
    consoleWindow.document.querySelector('.console-output')?.appendChild(outputDiv);
    consoleWindow.document.querySelector('.console-output').scrollTop = consoleWindow.document.querySelector('.console-output').scrollHeight;
  } else {
    // Only queue unique messages to avoid duplicates
    if (!consoleMessageQueue.some(item => item.message === message && item.color === color)) {
      consoleMessageQueue.push({ message, color });
    }
    console.log(`Console message queued: ${message} (console window not open)`);
    const fallbackConsole = document.getElementById('fallback-console');
    if (fallbackConsole) {
      fallbackConsole.style.display = 'block';
      const outputDiv = document.createElement('div');
      outputDiv.textContent = message;
      outputDiv.style.color = color;
      fallbackConsole.appendChild(outputDiv);
      fallbackConsole.scrollTop = fallbackConsole.scrollHeight;
    }
  }
}

/* Flush queued console messages */
function flushConsoleQueue() {
  if (consoleWindow && !consoleWindow.closed) {
    consoleMessageQueue.forEach(({ message, color }) => {
      const outputDiv = consoleWindow.document.createElement('div');
      outputDiv.textContent = message;
      outputDiv.style.color = color;
      consoleWindow.document.querySelector('.console-output')?.appendChild(outputDiv);
    });
    consoleWindow.document.querySelector('.console-output').scrollTop = consoleWindow.document.querySelector('.console-output').scrollHeight;
    consoleMessageQueue = []; // Clear queue after flushing
  }
}

/* Open console in new window */
function openConsoleWindow() {
  if (consoleWindow && !consoleWindow.closed) {
    consoleWindow.focus();
    flushConsoleQueue();
    return true;
  }
  try {
    consoleWindow = window.open('', 'consoleWindow', 'width=600,height=400');
    if (!consoleWindow) {
      // Display popup blocked message in fallback console only, not queued
      const fallbackConsole = document.getElementById('fallback-console');
      if (fallbackConsole) {
        fallbackConsole.style.display = 'block';
        const outputDiv = document.createElement('div');
        outputDiv.textContent = 'Error: Popup blocked. Please allow popups for this site in your browser settings and click the console button again.';
        outputDiv.style.color = 'red';
        fallbackConsole.appendChild(outputDiv);
        fallbackConsole.scrollTop = fallbackConsole.scrollHeight;
      }
      return false;
    }
    const consoleDoc = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Console</title>
        <style>
          body {
            font-family: 'Share Tech Mono', monospace;
            background-color: #0a0a23;
            color: #ffffff;
            margin: 0;
            padding: 10px;
            display: flex;
            flex-direction: column;
            height: 100vh;
          }
          .console-output {
            background-color: #1b1b32;
            padding: 10px;
            flex: 1;
            overflow-y: auto;
            border: 2px solid #3c8235;
            margin-bottom: 10px;
            font-size: 0.9rem;
          }
          .console-input {
            width: 100%;
            padding: 8px;
            background-color: #1b1b32;
            border: 2px solid #3c8235;
            color: #ffffff;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.9rem;
          }
          .console-input:focus {
            outline: none;
            border-color: #ffffff;
          }
        </style>
      </head>
      <body>
        <div class="console-output"></div>
        <input type="text" class="console-input" placeholder="Enter command...">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/10.6.4/math.min.js"></script>
        <script>
          window.safeEval = function(code) {
            try {
              return eval(code);
            } catch (err) {
              return { error: err.message };
            }
          };
          (function() {
            const originalConsoleLog = console.log;
            console.log = function(...args) {
              const outputDiv = document.querySelector('.console-output');
              if (outputDiv) {
                const message = args.map(arg => String(arg)).join(' ');
                const div = document.createElement('div');
                div.textContent = message;
                div.style.color = 'white';
                outputDiv.appendChild(div);
                outputDiv.scrollTop = outputDiv.scrollHeight;
              }
              originalConsoleLog.apply(console, args);
            };
          })();
          const input = document.querySelector('.console-input');
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
              const command = input.value.trim();
              const outputDiv = document.querySelector('.console-output');
              const commandDiv = document.createElement('div');
              commandDiv.textContent = \`> \${command}\`;
              commandDiv.style.color = '#3c8235';
              outputDiv.appendChild(commandDiv);
              try {
                const mathResult = window.math.evaluate(command);
                if (mathResult !== undefined) {
                  console.log(String(mathResult));
                }
              } catch (mathErr) {
                const result = window.safeEval(command);
                if (result && result.error) {
                  console.log(\`JavaScript Error: \${result.error}\`);
                } else {
                  console.log(String(result));
                }
              }
              outputDiv.scrollTop = outputDiv.scrollHeight;
              input.value = '';
            }
          });
          // Signal that console is ready
          window.consoleReady = true;
        </script>
      </body>
      </html>
    `;
    consoleWindow.document.write(consoleDoc);
    consoleWindow.document.close();
    flushConsoleQueue();
    if (pyodideActive) {
      appendToConsole('Pyodide initialized', 'green');
    }
    console.log('Console window opened successfully');
    return true;
  } catch (err) {
    appendToConsole(`Error opening console: ${err.message}. Please allow popups and click the console button again.`, 'red');
    console.error('Console open error:', err);
    return false;
  }
}

/* Run console command */
function runConsoleCommand(command, safeEval) {
  if (!command) return;
  appendToConsole(`> ${command}`);
  try {
    if (currentFile && currentFile.endsWith('.py')) {
      runPython(command);
    } else {
      try {
        const mathResult = consoleWindow.math.evaluate(command);
        if (mathResult !== undefined) {
          appendToConsole(String(mathResult));
          return;
        }
      } catch (mathErr) {}
      const result = safeEval(command);
      if (result && result.error) {
        appendToConsole(`JavaScript Error: ${result.error}`, 'red');
      } else {
        appendToConsole(String(result));
      }
    }
  } catch (err) {
    appendToConsole(`Error: ${err.message}`, 'red');
  }
}

/* Run JavaScript code from editor */
function runEditorCode() {
  console.log('runEditorCode called for file:', currentFile);
  if (!currentFile) {
    appendToConsole('Error: No file selected', 'red');
    return;
  }
  if (!currentFile.endsWith('.js')) {
    appendToConsole(`Info: Auto-run skipped for non-JavaScript file (${currentFile})`, 'yellow');
    return;
  }
  // Automatically open console if not open
  if (!consoleWindow || consoleWindow.closed) {
    if (!openConsoleWindow()) {
      return;
    }
  }
  const code = files[currentFile].content;
  if (!code.trim()) {
    appendToConsole('Info: No code to run', 'yellow');
    return;
  }
  if (!isValidJavaScript(code)) {
    appendToConsole('Error: Invalid JavaScript code', 'red');
    return;
  }
  // Wait for console window to be ready
  const checkConsoleReady = setInterval(() => {
    if (consoleWindow.consoleReady) {
      clearInterval(checkConsoleReady);
      try {
        appendToConsole(`Running ${currentFile}...`, 'green');
        const result = consoleWindow.safeEval(code);
        if (result && result.error) {
          appendToConsole(`JavaScript Error: ${result.error}`, 'red');
        } else {
          appendToConsole('Run complete', 'green');
        }
      } catch (err) {
        appendToConsole(`JavaScript Error: ${err.message}`, 'red');
      }
    }
  }, 100);
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
    appendToConsole('File saved', 'green');
  } else {
    appendToConsole('Error: No file selected', 'red');
  }
}

/* Update status bar */
function updateStatusBar() {
  const { line, ch } = editor.getCursor();
  document.querySelector('.status-bar span:first-child').textContent = `Ln ${line + 1}, Col ${ch + 1}`;
  document.querySelector('.status-bar span:last-child').textContent = `UTF-8 | ${files[currentFile]?.type || 'None'} | Spaces: 2`;
}

/* DOM elements */
const tabs = document.querySelector('.tabs');
const addFileBtn = document.querySelector('#add-file');
const fileInput = document.querySelector('#file-import');
const fileModal = document.querySelector('#file-modal');
const createNewFileBtn = document.querySelector('#create-new-file');
const cancelModalBtn = document.querySelector('#cancel-modal');
const newFileNameInput = document.querySelector('#new-file-name');
const openOutputBtn = document.querySelector('#open-output');
const openConsoleBtn = document.querySelector('#open-console');
const runCodeBtn = document.querySelector('#run-code');

/* Show file modal */
addFileBtn.addEventListener('click', () => {
  fileModal.style.display = 'flex';
});

/* Create new file */
createNewFileBtn.addEventListener('click', () => {
  const filename = newFileNameInput.value.trim();
  if (!filename) {
    appendToConsole('Error: Filename cannot be empty', 'red');
    return;
  }
  if (files[filename]) {
    appendToConsole(`Error: File "${filename}" already exists`, 'red');
    return;
  }
  const ext = filename.split('.').pop().toLowerCase();
  if (!['html', 'css', 'js', 'py', 'txt'].includes(ext)) {
    appendToConsole(`Error: Unsupported file type ".${ext}"`, 'red');
    return;
  }
  files[filename] = { content: '', type: ext };
  addTab(filename);
  loadFile(filename);
  saveFilesToStorage();
  fileModal.style.display = 'none';
  newFileNameInput.value = '';
  appendToConsole(`File "${filename}" created successfully`, 'green');
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
    appendToConsole('Error: No file selected', 'red');
    return;
  }
  const filename = file.name;
  const ext = filename.split('.').pop().toLowerCase();
  if (!['html', 'css', 'js', 'py', 'txt'].includes(ext)) {
    appendToConsole(`Error: Unsupported file type ".${ext}"`, 'red');
    e.target.value = '';
    return;
  }
  if (files[filename]) {
    appendToConsole(`Error: File "${filename}" already exists`, 'red');
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
      appendToConsole(`File "${filename}" imported successfully`, 'green');
    } catch (err) {
      appendToConsole(`Error importing file: ${err.message}`, 'red');
    }
    e.target.value = '';
  };
  reader.onerror = () => {
    appendToConsole('Error: Failed to read file', 'red');
    e.target.value = '';
  };
  reader.readAsText(file);
});

/* Editor changes with auto-run */
editor.on('change', () => {
  console.log('Editor change detected');
  if (currentFile && files[currentFile]) {
    files[currentFile].content = editor.getValue();
    saveFilesToStorage();
    /* Debounce auto-run */
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      console.log('Triggering auto-run');
      runEditorCode();
    }, 500);
  }
});

/* Cursor tracking */
editor.on('cursorActivity', updateStatusBar);

/* Open output in new window button */
openOutputBtn.addEventListener('click', openOutputInNewWindow);

/* Open console in new window button */
openConsoleBtn.addEventListener('click', () => {
  if (openConsoleWindow()) {
    appendToConsole('Console opened', 'green');
  }
});

/* Run code button */
runCodeBtn.addEventListener('click', () => {
  console.log('Run button clicked');
  runEditorCode();
});

/* Initialize files from local storage */
loadFilesFromStorage();
