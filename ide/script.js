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
      mode: 'text/plain'
    });

    // DOM elements
    const fileTree = document.querySelector('.file-tree');
    const tabs = document.querySelector('.tabs');
    const outputFrame = document.querySelector('.output iframe');
    const consoleInput = document.querySelector('.console input');
    const createBtn = document.querySelector('#create-file');
    const fileInput = document.querySelector('#file-import');
    const runBtn = document.querySelector('.menu button:nth-child(4)');

    // Validate JavaScript code
    function isValidJavaScript(code) {
      try {
        new Function(code);
        return true;
      } catch (err) {
        return false;
      }
    }

    // Add file to tree
    function addFileToTree(filename) {
      const li = document.createElement('li');
      li.textContent = filename;
      li.addEventListener('click', () => loadFile(filename));
      li.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (confirm(`Delete ${filename}?`)) deleteFile(filename);
      });
      fileTree.appendChild(li);
    }

    // Add tab
    function addTab(filename) {
      const tab = document.createElement('div');
      tab.className = 'tab';
      tab.textContent = filename;
      tab.addEventListener('click', () => loadFile(filename));
      tabs.appendChild(tab);
    }

    // Load file into editor
    function loadFile(filename) {
      currentFile = filename;
      const modes = { html: 'htmlmixed', css: 'css', js: 'javascript', py: 'python', txt: 'text/plain' };
      editor.setOption('mode', modes[files[filename].type]);
      editor.setValue(files[filename].content || '');
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      const tab = Array.from(document.querySelectorAll('.tab')).find(t => t.textContent === filename);
      if (tab) tab.classList.add('active');
      updateOutput();
      updateStatusBar();
    }

    // Update output
    function updateOutput() {
      const htmlFile = Object.keys(files).find(f => f.endsWith('.html'));
      const cssFile = Object.keys(files).find(f => f.endsWith('.css'));
      const jsFile = Object.keys(files).find(f => f.endsWith('.js'));
      const html = files[htmlFile]?.content || '';
      const css = files[cssFile]?.content || '';
      const js = files[jsFile]?.content || '';
      
      // Validate JavaScript before injecting
      if (js && !isValidJavaScript(js)) {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Error: Invalid JavaScript in output';
        errorDiv.style.color = 'red';
        document.querySelector('.console').insertBefore(errorDiv, consoleInput);
        outputFrame.srcdoc = '<h1>Invalid JavaScript</h1>';
        return;
      }

      const doc = `
        <html>
          <head><style>${css}</style></head>
          <body>${html}<script>${js}</script></body>
        </html>`;
      outputFrame.srcdoc = doc;
    }

    // Run Python code
    async function runPython(code) {
      if (!pyodideReady) {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Error: Pyodide not loaded yet';
        errorDiv.style.color = 'red';
        document.querySelector('.console').insertBefore(errorDiv, consoleInput);
        return;
      }
      try {
        const output = await pyodide.runPythonAsync(code);
        const outputDiv = document.createElement('div');
        outputDiv.textContent = output !== undefined ? String(output) : '';
        document.querySelector('.console').insertBefore(outputDiv, consoleInput);
      } catch (err) {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = `Python Error: ${err.message}`;
        errorDiv.style.color = 'red';
        document.querySelector('.console').insertBefore(errorDiv, consoleInput);
      }
      document.querySelector('.console').scrollTop = document.querySelector('.console').scrollHeight;
    }

    // Delete file
    function deleteFile(filename) {
      delete files[filename];
      document.querySelectorAll(`.file-tree li`).forEach(li => {
        if (li.textContent === filename) li.remove();
      });
      document.querySelectorAll(`.tabs .tab`).forEach(tab => {
        if (tab.textContent === filename) tab.remove();
      });
      if (currentFile === filename) {
        editor.setValue('');
        currentFile = null;
        updateStatusBar();
      }
      updateOutput();
    }

    // Update status bar
    function updateStatusBar() {
      const { line, ch } = editor.getCursor();
      document.querySelector('.status-bar span:first-child').textContent = `Ln ${line + 1}, Col ${ch + 1}`;
      document.querySelector('.status-bar span:last-child').textContent = `UTF-8 | ${files[currentFile]?.type || 'None'} | Spaces: 2`;
    }

    // File creation
    createBtn.addEventListener('click', () => {
      const filename = prompt('Enter file name (e.g., index.html):');
      if (filename && !files[filename]) {
        const ext = filename.split('.').pop().toLowerCase();
        if (['html', 'css', 'js', 'py', 'txt'].includes(ext)) {
          files[filename] = { content: '', type: ext };
          addFileToTree(filename);
          addTab(filename);
          loadFile(filename);
        } else {
          alert('Unsupported file type');
        }
      } else {
        alert('Invalid or duplicate filename');
      }
    });

    // File import
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const filename = file.name;
        const ext = filename.split('.').pop().toLowerCase();
        if (['html', 'css', 'js', 'py', 'txt'].includes(ext)) {
          files[filename] = { content: e.target.result, type: ext };
          addFileToTree(filename);
          addTab(filename);
          loadFile(filename);
        } else {
          alert('Unsupported file type');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    // Editor changes
    editor.on('change', () => {
      if (currentFile) {
        files[currentFile].content = editor.getValue();
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
        const command = consoleInput.value.trim();
        if (!command) return;
        const outputDiv = document.createElement('div');
        outputDiv.textContent = `> ${command}`;
        document.querySelector('.console').insertBefore(outputDiv, consoleInput);
        try {
          if (currentFile && currentFile.endsWith('.js') && isValidJavaScript(command)) {
            const result = eval(command);
            const resultDiv = document.createElement('div');
            resultDiv.textContent = result !== undefined ? String(result) : '';
            document.querySelector('.console').insertBefore(resultDiv, consoleInput);
          } else if (currentFile && currentFile.endsWith('.py')) {
            await runPython(command);
          } else {
            const errorDiv = document.createElement('div');
            errorDiv.textContent = 'Error: No valid file context or invalid command';
            errorDiv.style.color = 'red';
            document.querySelector('.console').insertBefore(errorDiv, consoleInput);
          }
        } catch (err) {
          const errorDiv = document.createElement('div');
          errorDiv.textContent = `JavaScript Error: ${err.message}`;
          errorDiv.style.color = 'red';
          document.querySelector('.console').insertBefore(errorDiv, consoleInput);
        }
        consoleInput.value = '';
        document.querySelector('.console').scrollTop = document.querySelector('.console').scrollHeight;
      }
    });

    // Run button
    runBtn.addEventListener('click', async () => {
      if (currentFile) {
        if (currentFile.endsWith('.html') || currentFile.endsWith('.css') || currentFile.endsWith('.js')) {
          updateOutput();
        } else if (currentFile.endsWith('.py')) {
          await runPython(files[currentFile].content);
        }
      } else {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Error: No file selected';
        errorDiv.style.color = 'red';
        document.querySelector('.console').insertBefore(errorDiv, consoleInput);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (currentFile) {
          files[currentFile].content = editor.getValue();
          alert('File saved');
        }
      } else if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        runBtn.click();
      }
    });
