/* Global state */
let files = {};
let currentFile = null;
let editor = null;
let pyodide = null;
let pyodideActive = false;
let pyodideInitialized = false;
let consoleWindow = null;
let debounceTimeout = null;
let consoleMessageQueue = [];

/* Initialize Pyodide */
async function initializePyodide() {
  if (pyodideInitialized) return;
  try {
    pyodide = await loadPyodide();
    pyodideActive = true;
    pyodideInitialized = true;
    if (currentFile && currentFile.endsWith('.py')) {
      appendToConsole('Pyodide initialized', 'green');
    }
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
  appendToConsole('Default files created: index.html, styles.css, script.js', 'green');
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
    } else {
      initializeDefaultFiles();
    }
  } else {
    initializeDefaultFiles();
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

function openOutputInNewWindow() {
  const htmlFiles = Object.keys(files).filter(f => f.endsWith('.html'));
  const cssFiles = Object.keys(files).filter(f => f.endsWith('.css'));
  const jsFiles = Object.keys(files).filter(f => f.endsWith('.js'));

  for (const jsFile of jsFiles) {
    if (!isValidJavaScript(files[jsFile].content)) {
      appendToConsole(`Cannot open output: Invalid JavaScript in ${jsFile}`, 'red');
      return;
    }
  }

  try {
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      appendToConsole('Error: Popup blocked. Please allow popups for this site.', 'red');
      return;
    }

    let htmlContent = '';
    let selectedHtmlFile = currentFile && currentFile.endsWith('.html') ? currentFile : htmlFiles[0];
    if (selectedHtmlFile && files[selectedHtmlFile]) {
      htmlContent = files[selectedHtmlFile].content;
    } else if (htmlFiles.length > 0) {
      htmlContent = files[htmlFiles[0]].content;
      selectedHtmlFile = htmlFiles[0];
    } else {
      htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Output</title>
        </head>
        <body>
          <h1>No HTML file provided</h1>
        </body>
        </html>
      `;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Embed CSS files
    cssFiles.forEach(cssFile => {
      const style = doc.createElement('style');
      style.textContent = files[cssFile].content;
      doc.head.appendChild(style);
    });

    // Embed JS files
    jsFiles.forEach(jsFile => {
      const script = doc.createElement('script');
      script.textContent = files[jsFile].content;
      doc.body.appendChild(script);
    });

    // Add navigation handler script
    const navigationScript = doc.createElement('script');
    navigationScript.textContent = `
      // Store files object in the window for access
      window.__files = ${JSON.stringify(files)};
      document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href]');
        if (link) {
          const href = link.getAttribute('href');
          if (window.__files[href] && href.endsWith('.html')) {
            e.preventDefault();
            const parser = new DOMParser();
            const doc = parser.parseFromString(window.__files[href].content, 'text/html');
            // Re-embed CSS files
            ${JSON.stringify(cssFiles)}.forEach(cssFile => {
              const style = document.createElement('style');
              style.textContent = window.__files[cssFile].content;
              doc.head.appendChild(style);
            });
            // Re-embed JS files
            ${JSON.stringify(jsFiles)}.forEach(jsFile => {
              const script = document.createElement('script');
              script.textContent = window.__files[jsFile].content;
              doc.body.appendChild(script);
            });
            // Update document content
            document.open();
            document.write(new XMLSerializer().serializeToString(doc));
            document.close();
            // Update history to reflect new URL
            history.pushState(null, '', href);
          }
        }
      });
    `;
    doc.body.appendChild(navigationScript);

    const serializer = new XMLSerializer();
    const finalHtml = serializer.serializeToString(doc);

    newWindow.document.write(finalHtml);
    newWindow.document.close();
    appendToConsole(`Output opened using HTML: ${selectedHtmlFile || 'default'}, CSS: [${cssFiles.join(', ') || 'none'}], JS: [${jsFiles.join(', ') || 'none'}]`, 'green');
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
      if (!(message === 'Pyodide initialized' && currentFile && !currentFile.endsWith('.py'))) {
        const outputDiv = consoleWindow.document.createElement('div');
        outputDiv.textContent = message;
        outputDiv.style.color = color;
        consoleWindow.document.querySelector('.console-output')?.appendChild(outputDiv);
      }
    });
    consoleWindow.document.querySelector('.console-output').scrollTop = consoleWindow.document.querySelector('.console-output').scrollHeight;
    consoleMessageQueue = [];
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
          window.consoleReady = true;
        </script>
      </body>
      </html>
    `;
    consoleWindow.document.write(consoleDoc);
    consoleWindow.document.close();
    flushConsoleQueue();
    appendToConsole('Console opened', 'green');
    return true;
  } catch (err) {
    appendToConsole(`Error opening console: ${err.message}. Please allow popups and click the console button again.`, 'red');
    console.error('Console open error:', err);
    return false;
  }
}

/* Run Python code */
async function runPython(code) {
  if (!pyodideActive) {
    appendToConsole('Error: Pyodide not initialized', 'red');
    return;
  }
  try {
    const result = await pyodide.runPythonAsync(code);
    if (result !== undefined) {
      appendToConsole(String(result));
    }
  } catch (err) {
    appendToConsole(`Python Error: ${err.message}`, 'red');
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
      } catch (mathErr) {
        const result = safeEval(command);
        if (result && result.error) {
          appendToConsole(`JavaScript Error: ${result.error}`, 'red');
        } else {
          appendToConsole(String(result));
        }
      }
    }
  } catch (err) {
    appendToConsole(`Error: ${err.message}`, 'red');
  }
}

/* Run editor code */
function runEditorCode() {
  console.log('runEditorCode called for file:', currentFile);
  if (!currentFile) {
    appendToConsole('Error: No file selected', 'red');
    return;
  }
  if (!openConsoleWindow()) {
    return;
  }
  const checkConsoleReady = setInterval(() => {
    if (consoleWindow.consoleReady) {
      clearInterval(checkConsoleReady);
      const code = files[currentFile].content;
      if (!code.trim()) {
        appendToConsole('Info: No code to run', 'yellow');
        return;
      }
      if (currentFile.endsWith('.py')) {
        appendToConsole(`Running ${currentFile}...`, 'green');
        runPython(code);
      } else if (currentFile.endsWith('.js')) {
        if (!isValidJavaScript(code)) {
          appendToConsole('Error: Invalid JavaScript code', 'red');
          return;
        }
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
      } else {
        appendToConsole(`Info: Auto-run skipped for non-JavaScript/Python file (${currentFile})`, 'yellow');
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
    appendToConsole(`File "${filename}" deleted successfully`, 'green');
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
    appendToConsole(`File "${filename}" saved successfully`, 'green');
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

/* Clear editor code */
function clearEditorCode() {
  if (!currentFile) {
    appendToConsole('Error: No file selected', 'red');
    return;
  }
  if (confirm(`Are you sure you want to clear the code in ${currentFile}?`)) {
    files[currentFile].content = '';
    editor.setValue('');
    saveFilesToStorage();
    appendToConsole(`Code in "${currentFile}" cleared successfully`, 'green');
  }
}

/* Clear code button */
const clearCodeBtn = document.querySelector('#clear-code');
clearCodeBtn.addEventListener('click', clearEditorCode);

/* Download all files as ZIP */
function downloadAllFiles() {
  if (Object.keys(files).length === 0) {
    appendToConsole('Error: No files to download', 'red');
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
      appendToConsole('All files downloaded as project-files.zip', 'green');
    }).catch(err => {
      appendToConsole(`Error creating ZIP: ${err.message}`, 'red');
    });
  }
}

/* Download all files button */
const downloadAllBtn = document.querySelector('#download-all');
downloadAllBtn.addEventListener('click', downloadAllFiles);

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

/* Editor changes */
editor.on('change', () => {
  console.log('Editor change detected');
  if (currentFile && files[currentFile]) {
    files[currentFile].content = editor.getValue();
    saveFilesToStorage();
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
