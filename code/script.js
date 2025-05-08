const textarea = document.getElementById('codeInput');
const errorDiv = document.getElementById('errorMessages');
const outputFrame = document.getElementById('outputFrame');
const outputSection = document.getElementById('outputSection');
const lineNumbers = document.getElementById('lineNumbers');
const lineNumbersPre = lineNumbers.querySelector('pre');
const saveFileContainer = document.getElementById('saveFileContainer');
const saveFileInput = document.getElementById('saveFileInput');
const MAX_LINES = 9999;

// Handle Tab key to insert two spaces
textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        updateLineNumbers();
    }
});

// Handle Enter key to maintain indentation
textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const currentLine = value.substring(lineStart, start);
        const indentMatch = currentLine.match(/^\s*/);
        let indent = indentMatch ? indentMatch[0] : '';
        if (currentLine.trim().endsWith(':')) {
            indent += '  ';
        }
        textarea.value = value.substring(0, start) + '\n' + indent + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + indent.length + 1;
        updateLineNumbers();
    }
});

function updateLineNumbers() {
    const lines = textarea.value.split('\n');
    const numberOfLines = Math.min(lines.length, MAX_LINES);
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 20;
    const visibleHeight = textarea.clientHeight - 24;
    const visibleLines = Math.ceil(visibleHeight / lineHeight);
    const scrollTop = textarea.scrollTop;
    const firstVisibleLine = Math.floor(scrollTop / lineHeight);

    const allNumbers = Array.from(
        { length: Math.max(numberOfLines, firstVisibleLine + visibleLines) },
        (_, i) => i + 1
    );

    let visibleNumbers = allNumbers.slice(firstVisibleLine, firstVisibleLine + visibleLines);
    while (visibleNumbers.length < visibleLines) {
        visibleNumbers.push('');
    }

    lineNumbersPre.innerHTML = visibleNumbers.join('\n');

    if (lines.length > MAX_LINES) {
        textarea.value = lines.slice(0, MAX_LINES).join('\n');
    }

    requestAnimationFrame(() => {
        lineNumbers.scrollTop = scrollTop;
    });
}

textarea.addEventListener('input', updateLineNumbers);
textarea.addEventListener('scroll', updateLineNumbers);
window.addEventListener('resize', updateLineNumbers);

updateLineNumbers();

function removeComments(code, language) {
    const lines = code.split('\n');
    const result = [];
    let inMultiLineComment = false;
    let inString = false;
    let stringChar = '';

    if (language === 'html') {
        for (let line of lines) {
            line = line.replace(/<!--[\s\S]*?-->/g, '');
            result.push(line);
        }
    } else if (['javascript', 'java', 'cpp', 'rust', 'go', 'swift', 'kotlin', 'typescript', 'csharp'].includes(language)) {
        for (let line of lines) {
            let newLine = '';
            let i = 0;
            while (i < line.length) {
                if (inString) {
                    newLine += line[i];
                    if (line[i] === stringChar && line[i - 1] !== '\\') {
                        inString = false;
                    }
                    i++;
                } else if (inMultiLineComment) {
                    if (i + 1 < line.length && line[i] === '*' && line[i + 1] === '/') {
                        inMultiLineComment = false;
                        i += 2;
                    } else {
                        i++;
                    }
                } else {
                    if (line[i] === '"' || line[i] === "'") {
                        inString = true;
                        stringChar = line[i];
                        newLine += line[i];
                        i++;
                    } else if (i + 1 < line.length && line[i] === '/' && line[i + 1] === '*') {
                        inMultiLineComment = true;
                        i += 2;
                    } else if (i + 1 < line.length && line[i] === '/' && line[i + 1] === '/') {
                        break;
                    } else {
                        newLine += line[i];
                        i++;
                    }
                }
            }
            result.push(newLine);
        }
    } else if (['python', 'ruby', 'r'].includes(language)) {
        for (let line of lines) {
            let newLine = '';
            let i = 0;
            while (i < line.length) {
                if (inString) {
                    newLine += line[i];
                    if (line[i] === stringChar && line[i - 1] !== '\\') {
                        inString = false;
                    }
                    i++;
                } else if (line[i] === '#' && !inString) {
                    break;
                } else if (line[i] === '"' || line[i] === "'") {
                    inString = true;
                    stringChar = line[i];
                    newLine += line[i];
                    i++;
                } else {
                    newLine += line[i];
                    i++;
                }
            }
            result.push(newLine);
        }
    } else if (language === 'css') {
        for (let line of lines) {
            line = line.replace(/\/\*[\s\S]*?\*\//g, '');
            result.push(line);
        }
    } else if (language === 'php') {
        for (let line of lines) {
            let newLine = '';
            let i = 0;
            while (i < line.length) {
                if (inString) {
                    newLine += line[i];
                    if (line[i] === stringChar && line[i - 1] !== '\\') {
                        inString = false;
                    }
                    i++;
                } else if (inMultiLineComment) {
                    if (i + 1 < line.length && line[i] === '*' && line[i + 1] === '/') {
                        inMultiLineComment = false;
                        i += 2;
                    } else {
                        i++;
                    }
                } else {
                    if (line[i] === '"' || line[i] === "'") {
                        inString = true;
                        stringChar = line[i];
                        newLine += line[i];
                        i++;
                    } else if (i + 1 < line.length && line[i] === '/' && line[i + 1] === '*') {
                        inMultiLineComment = true;
                        i += 2;
                    } else if (i + 1 < line.length && line[i] === '/' && line[i + 1] === '/') {
                        break;
                    } else if (line[i] === '#') {
                        break;
                    } else {
                        newLine += line[i];
                        i++;
                    }
                }
            }
            result.push(newLine);
        }
    } else if (language === 'sql') {
        for (let line of lines) {
            line = line.replace(/--.*$/gm, '');
            result.push(line);
        }
    }
    return result.join('\n');
}

const languageValidators = {
    html: (code) => {
        console.log('Validating HTML');
        const errors = [];
        const cleanCode = removeComments(code, 'html');

        if (!cleanCode.match(/^<!DOCTYPE\s+html>/i)) {
            errors.push({ message: 'Missing DOCTYPE declaration', line: 1 });
        }

        const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
        const stack = [];
        let lineNum = 1;
        let inScript = false;
        let inStyle = false;
        let i = 0;

        const lines = cleanCode.split('\n');
        let currentLineContent = '';
        let lineIndex = 0;

        while (i < cleanCode.length) {
            if (cleanCode[i] === '\n') {
                lineNum++;
                lineIndex++;
                currentLineContent = lines[lineIndex] || '';
                i++;
                continue;
            }

            currentLineContent = currentLineContent || lines[lineIndex] || '';
            const remainingCode = cleanCode.slice(i);
            const tagMatch = remainingCode.match(/^<(\/)?([a-z][a-z0-9]*)\b[^>]*?(\/)?>/i);

            if (tagMatch) {
                const isClosing = !!tagMatch[1];
                const tagName = tagMatch[2].toLowerCase();
                const isSelfClosing = !!tagMatch[3] || voidElements.includes(tagName);
                const matchLength = tagMatch[0].length;

                if (tagName === 'script') {
                    inScript = isClosing ? false : true;
                    i += matchLength;
                    continue;
                }
                if (tagName === 'style') {
                    inStyle = isClosing ? false : true;
                    i += matchLength;
                    continue;
                }
                if (inScript || inStyle) {
                    i++;
                    continue;
                }

                if (!isClosing) {
                    if (!isSelfClosing) {
                        stack.push({ name: tagName, line: lineNum });
                    }
                } else {
                    if (stack.length === 0) {
                        errors.push({
                            message: `Unexpected closing tag </${tagName}> with no matching opening tag`,
                            line: lineNum
                        });
                    } else {
                        const lastTag = stack[stack.length - 1];
                        if (lastTag.name === tagName) {
                            stack.pop();
                        } else {
                            errors.push({
                                message: `Mismatched closing tag: expected </${lastTag.name}>, found </${tagName}>`,
                                line: lineNum
                            });
                            stack.length = 0; // Reset stack to prevent cascading errors
                            break;
                        }
                    }
                }
                i += matchLength;
            } else {
                i++;
            }
        }

        if (stack.length > 0) {
            stack.forEach(tag => {
                errors.push({
                    message: `Unclosed tag <${tag.name}>`,
                    line: tag.line
                });
            });
        }

        console.log('HTML errors:', errors);
        return errors;
    },
    css: (code) => {
        const errors = [];
        const cleanCode = removeComments(code, 'css');
        const lines = cleanCode.split('\n');
        let braceCount = 0;

        lines.forEach((line, i) => {
            if (!line.trim()) return;
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;
            if (braceCount < 0) {
                errors.push({
                    message: 'Extra closing brace',
                    line: i + 1
                });
                braceCount = 0;
            }
        });

        if (braceCount > 0) {
            errors.push({
                message: `Missing ${braceCount} closing brace(s)`,
                line: lines.length
            });
        }

        return errors;
    },
    python: (code) => {
        const errors = [];
        const cleanCode = removeComments(code, 'python');
        const lines = cleanCode.split('\n');

        lines.forEach((line, i) => {
            if (!line.trim()) return;
            const trimmed = line.trim();
            if (trimmed.match(/^(if|elif|else|for|while|def|class|try|except|with)/) && !trimmed.endsWith(':')) {
                errors.push({
                    message: `Missing colon after ${trimmed.split(' ')[0]} statement`,
                    line: i + 1
                });
            }
        });

        return errors;
    },
    javascript: (code) => {
        const errors = [];
        const cleanCode = removeComments(code, 'javascript');

        try {
            new Function(cleanCode);
        } catch (e) {
            const match = e.message.match(/line (\d+)/i);
            const lineNum = match ? parseInt(match[1]) : null;
            errors.push({
                message: `Syntax error: ${e.message}`,
                line: lineNum
            });
        }

        return errors;
    },
    java: (code) => {
        const errors = [];
        const cleanCode = removeComments(code, 'java');
        const lines = cleanCode.split('\n');
        let braceCount = 0;

        lines.forEach((line, i) => {
            if (!line.trim()) return;
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;
            if (braceCount < 0) {
                errors.push({
                    message: 'Extra closing brace',
                    line: i + 1
                });
                braceCount = 0;
            }
        });

        if (braceCount > 0) {
            errors.push({
                message: `Missing ${braceCount} closing brace(s)`,
                line: lines.length
            });
        }

        return errors;
    },
    cpp: (code) => {
        const errors = [];
        const cleanCode = removeComments(code, 'cpp');
        const lines = cleanCode.split('\n');
        let braceCount = 0;

        lines.forEach((line, i) => {
            if (!line.trim()) return;
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;
            if (braceCount < 0) {
                errors.push({
                    message: 'Extra closing brace',
                    line: i + 1
                });
                braceCount = 0;
            }
        });

        if (braceCount > 0) {
            errors.push({
                message: `Missing ${braceCount} closing brace(s)`,
                line: lines.length
            });
        }

        return errors;
    },
    rust: (code) => {
        const errors = [];
        const cleanCode = removeComments(code, 'rust');
        const lines = cleanCode.split('\n');
        let braceCount = 0;

        lines.forEach((line, i) => {
            if (!line.trim()) return;
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;
            if (braceCount < 0) {
                errors.push({
                    message: 'Extra closing brace',
                    line: i + 1
                });
                braceCount = 0;
            }
        });

        if (braceCount > 0) {
            errors.push({
                message: `Missing ${braceCount} closing brace(s)`,
                line: lines.length
            });
        }

        return errors;
    },
    go: (code) => {
        const errors = [];
        const cleanCode = removeComments(code, 'go');
        const lines = cleanCode.split('\n');
        let braceCount = 0;

        lines.forEach((line, i) => {
            if (!line.trim()) return;
            const trimmed = line.trim();
            if (trimmed.match(/^func\s+\w+\s*\(/) && !trimmed.endsWith('{')) {
                errors.push({
                    message: 'Missing opening brace after func declaration',
                    line: i + 1
                });
            }
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;
            if (braceCount < 0) {
                errors.push({
                    message: 'Extra closing brace',
                    line: i + 1
                });
                braceCount = 0;
            }
        });

        if (braceCount > 0) {
            errors.push({
                message: `Missing ${braceCount} closing brace(s)`,
                line: lines.length
            });
        }

        return errors;
    },
    ruby: (code) => {
        console.log('Validating Ruby');
        const errors = [];
        const cleanCode = removeComments(code, 'ruby');
        const lines = cleanCode.split('\n');
        let blockCount = 0;

        lines.forEach((line, i) => {
            if (!line.trim()) return;
            const trimmed = line.trim();
            if (trimmed.match(/^(def|class|module|do|if|unless|while|until|for|begin)\b/)) {
                blockCount++;
            }
            if (trimmed === 'end') {
                blockCount--;
                if (blockCount < 0) {
                    errors.push({
                        message: 'Extra end keyword',
                        line: i + 1
                    });
                    blockCount = 0;
                }
            }
        });

        if (blockCount > 0) {
            errors.push({
                message: `Missing ${blockCount} end keyword(s)`,
                line: lines.length
            });
        }

        console.log('Ruby errors:', errors);
        return errors;
    },
    php: (code) => {
        const errors = [];
        const cleanCode = removeComments(code, 'php');
        const lines = cleanCode.split('\n');
        let braceCount = 0;

        lines.forEach((line, i) => {
            if (!line.trim()) return;
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;
            if (braceCount < 0) {
                errors.push({
                    message: 'Extra closing brace',
                    line: i + 1
                });
                braceCount = 0;
            }
        });

        if (braceCount > 0) {
            errors.push({
                message: `Missing ${braceCount} closing brace(s)`,
                line: lines.length
            });
        }

        return errors;
    },
    swift: (code) => {
        const errors = [];
        const cleanCode = removeComments(code, 'swift');
        const lines = cleanCode.split('\n');
        let braceCount = 0;

        lines.forEach((line, i) => {
            if (!line.trim()) return;
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;
            if (braceCount < 0) {
                errors.push({
                    message: 'Extra closing brace',
                    line: i + 1
                });
                braceCount = 0;
            }
        });

        if (braceCount > 0) {
            errors.push({
                message: `Missing ${braceCount} closing brace(s)`,
                line: lines.length
            });
        }

        return errors;
    },
    kotlin: (code) => {
        const errors = [];
        const cleanCode = removeComments(code, 'kotlin');
        const lines = cleanCode.split('\n');
        let braceCount = 0;

        lines.forEach((line, i) => {
            if (!line.trim()) return;
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;
            if (braceCount < 0) {
                errors.push({
                    message: 'Extra closing brace',
                    line: i + 1
                });
                braceCount = 0;
            }
        });

        if (braceCount > 0) {
            errors.push({
                message: `Missing ${braceCount} closing brace(s)`,
                line: lines.length
            });
        }

        return errors;
    },
    typescript: (code) => {
        console.log('Validating TypeScript');
        const errors = [];
        const cleanCode = removeComments(code, 'typescript');
        let jsCode = cleanCode
            .replace(/:\s*[^=>,\);{}\n]*?(?=[,\);}]|\s|$)/g, '')
            .replace(/\binterface\s+\w+\s*{[^}]*}/g, '')
            .replace(/\btype\s+\w+\s*=[^;]*;/g, '')
            .replace(/<[^>]*>/g, '')
            .replace(/\b(as|implements|extends)\s+[^,\);{}]*/g, '')
            .replace(/\?\s*/g, '')
            .replace(/:\s*void\b/g, '');

        console.log('Transformed TypeScript to JS:', jsCode);

        try {
            new Function(jsCode);
        } catch (e) {
            const match = e.message.match(/line (\d+)/i);
            const lineNum = match ? parseInt(match[1]) : null;
            errors.push({
                message: `Syntax error: ${e.message}`,
                line: lineNum
            });
        }

        console.log('TypeScript errors:', errors);
        return errors;
    },
    csharp: (code) => {
        const errors = [];
        const cleanCode = removeComments(code, 'csharp');
        const lines = cleanCode.split('\n');
        let braceCount = 0;

        lines.forEach((line, i) => {
            if (!line.trim()) return;
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;
            if (braceCount < 0) {
                errors.push({
                    message: 'Extra closing brace',
                    line: i + 1
                });
                braceCount = 0;
            }
        });

        if (braceCount > 0) {
            errors.push({
                message: `Missing ${braceCount} closing brace(s)`,
                line: lines.length
            });
        }

        return errors;
    },
    r: (code) => {
        const errors = [];
        const cleanCode = removeComments(code, 'r');
        const lines = cleanCode.split('\n');
        let parenCount = 0;

        lines.forEach((line, i) => {
            if (!line.trim()) return;
            parenCount += (line.match(/\(/g) || []).length;
            parenCount -= (line.match(/\)/g) || []).length;
            if (parenCount < 0) {
                errors.push({
                    message: 'Extra closing parenthesis',
                    line: i + 1
                });
                parenCount = 0;
            }
        });

        if (parenCount > 0) {
            errors.push({
                message: `Missing ${parenCount} closing parenthesis`,
                line: lines.length
            });
        }

        return errors;
    },
    sql: (code) => {
        const errors = [];
        const cleanCode = removeComments(code, 'sql');
        const lines = cleanCode.split('\n');

        lines.forEach((line, i) => {
            if (!line.trim()) return;
            const trimmed = line.trim();
            if (trimmed.match(/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)/i) && !trimmed.endsWith(';')) {
                errors.push({
                    message: 'Missing semicolon at the end of SQL statement',
                    line: i + 1
                });
            }
        });

        return errors;
    }
};

function detectLanguage(code) {
    code = code.trim().toLowerCase();
    if (/^<!doctype|<html/i.test(code)) return 'html';
    if (/\b(def\s+\w+\s*\([^)]*\))/i.test(code)) return 'ruby';
    if (/\binterface |type |: \w+/.test(code) && /\b(function|let |const )/.test(code)) return 'typescript';
    if (/\{.*:.*;\}/.test(code) && !/function/.test(code)) return 'css';
    if (/\b(def |import |print\()/i.test(code) || /^[ \t]*if.*:/i.test(code)) return 'python';
    if (/\b(function|let |const |=>)/i.test(code)) return 'javascript';
    if (/\bpublic\s+class\b/.test(code) && /\bmain\b/.test(code)) return 'java';
    if (/#include|int main|void main/.test(code)) return 'cpp';
    if (/\b(fn |let |mut |struct |impl )/.test(code)) return 'rust';
    if (/\b(func |package |import ")/.test(code)) return 'go';
    if (/<\?php|\$\w+/.test(code)) return 'php';
    if (/\b(func |struct |var |let )/.test(code) && !/\b(fn )/.test(code)) return 'swift';
    if (/\b(fun |val |var |class )/.test(code)) return 'kotlin';
    if (/\b(class |public static void Main)/.test(code)) return 'csharp';
    if (/\b(<-|data.frame|ggplot)/.test(code)) return 'r';
    if (/\b(SELECT |INSERT |UPDATE |DELETE |CREATE |ALTER |DROP )/i.test(code)) return 'sql';
    return 'html';
}

function validateCode() {
    errorDiv.innerHTML = '';
    errorDiv.style.color = 'red';
    const code = textarea.value.trim();

    if (!code) {
        errorDiv.innerHTML = 'No code entered';
        outputSection.style.display = 'none';
        return;
    }

    const language = detectLanguage(code);
    console.log('Detected language:', language);
    const errors = languageValidators[language](code);

    if (errors.length > 0) {
        errorDiv.innerHTML = errors
            .map(error => {
                return error.line ? `Line ${error.line}: ${error.message}` : error.message;
            })
            .join('<br>');
        errorDiv.style.color = 'red';
    } else {
        errorDiv.innerHTML = 'No syntax errors detected';
        errorDiv.style.color = 'red';
        setTimeout(() => {
            errorDiv.innerHTML = '';
            errorDiv.style.color = 'red';
        }, 2000);
    }
}

function executeCode() {
    const code = textarea.value.trim();

    try {
        if (!code) {
            errorDiv.innerHTML = 'No code entered';
            errorDiv.style.color = 'red';
            outputFrame.srcdoc = '';
            outputSection.style.display = 'none';
            return;
        }

        const language = detectLanguage(code);

        if (language === 'html') {
            outputFrame.srcdoc = code;
            outputSection.style.display = 'block';
        } else {
            const hasHtmlTags = /<[a-z][\s\S]*>/i.test(code);
            if (hasHtmlTags) {
                outputFrame.srcdoc = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Output</title></head><body>${code}</body></html>`;
                outputSection.style.display = 'block';
            } else {
                outputFrame.srcdoc = '';
                outputSection.style.display = 'none';
                errorDiv.innerHTML = 'No visible output for this code. Only HTML content is displayed in the output section.';
                errorDiv.style.color = 'red';
                return;
            }
        }

        errorDiv.innerHTML = 'No syntax errors detected';
        errorDiv.style.color = 'red';
        setTimeout(() => {
            errorDiv.innerHTML = '';
            errorDiv.style.color = 'red';
        }, 3000);

    } catch (e) {
        errorDiv.innerHTML = 'Execution error';
        errorDiv.style.color = 'red';
        outputFrame.srcdoc = '';
        outputSection.style.display = 'none';
    }
}

function showSaveFileInput() {
    console.log('showSaveFileInput called');
    try {
        const code = textarea.value.trim();
        if (!code) {
            errorDiv.innerHTML = 'Please enter some code to save';
            errorDiv.style.color = 'red';
            outputSection.style.display = 'none';
            setTimeout(() => {
                errorDiv.innerHTML = '';
                errorDiv.style.color = 'red';
            }, 5000);
            return;
        }
        saveFileContainer.style.display = 'flex';
        console.log('saveFileContainer display set to flex');
        saveFileInput.focus();
        errorDiv.innerHTML = '';
    } catch (e) {
        console.error('Error in showSaveFileInput:', e);
        errorDiv.innerHTML = 'Error displaying save input';
        errorDiv.style.color = 'red';
    }
}

function saveCode() {
    console.log('saveCode called');
    const code = textarea.value.trim();
    const fileName = saveFileInput.value.trim();

    try {
        if (!code) {
            errorDiv.innerHTML = 'No code entered';
            errorDiv.style.color = 'red';
            return;
        }

        if (!fileName) {
            errorDiv.innerHTML = 'Please enter a file name';
            errorDiv.style.color = 'red';
            return;
        }

        const extension = fileName.split('.').pop().toLowerCase();
        let mimeType = 'text/plain';
        switch (extension) {
            case 'html':
            case 'htm':
                mimeType = 'text/html';
                break;
            case 'js':
                mimeType = 'application/javascript';
                break;
            case 'py':
                mimeType = 'text/x-python';
                break;
            case 'css':
                mimeType = 'text/css';
                break;
            case 'java':
                mimeType = 'text/x-java';
                break;
            case 'cpp':
            case 'c':
            case 'h':
                mimeType = 'text/x-c++src';
                break;
            case 'rs':
                mimeType = 'text/x-rust';
                break;
            case 'go':
                mimeType = 'text/x-go';
                break;
            case 'rb':
                mimeType = 'text/x-ruby';
                break;
            case 'php':
                mimeType = 'application/x-php';
                break;
            case 'swift':
                mimeType = 'text/x-swift';
                break;
            case 'kt':
                mimeType = 'text/x-kotlin';
                break;
            case 'ts':
                mimeType = 'application/typescript';
                break;
            case 'cs':
                mimeType = 'text/x-csharp';
                break;
            case 'r':
                mimeType = 'text/x-r';
                break;
            case 'sql':
                mimeType = 'text/x-sql';
                break;
        }

        let content = code;
        if (['html', 'htm'].includes(extension) && (code.includes('<html') || code.includes('<!DOCTYPE'))) {
            content = code;
        } else if (['html', 'htm'].includes(extension)) {
            content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saved Code - CODEXEDOC</title>
</head>
<body>
${code}
</body>
</html>`;
        }

        const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
        const link = document.createElement('a');

        if ('download' in link) {
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.log('Download attribute not supported, using fallback');
            const url = URL.createObjectURL(blob);
            window.location.href = url;
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }

        errorDiv.innerHTML = 'File saved successfully';
        errorDiv.style.color = 'red';
        saveFileContainer.style.display = 'none';
        saveFileInput.value = '';

        setTimeout(() => {
            errorDiv.innerHTML = '';
            errorDiv.style.color = 'red';
        }, 3000);

    } catch (e) {
        console.error('Error in saveCode:', e);
        errorDiv.innerHTML = 'Error saving file';
        errorDiv.style.color = 'red';
    }
}

saveFileInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveCode();
    }
});
