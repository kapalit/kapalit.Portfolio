// Matrix rain effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Terminal functionality
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-body');
const contentPanels = document.getElementById('content-panels');

const commands = {
    help: {
        description: 'Display available commands',
        execute: () => {
            return `
Available commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  about      - Display information about me
  skills     - Show my technical skills
  projects   - View my projects
  contact    - Get contact information
  search     - Search through content (usage: search [term])
  clear      - Clear terminal
  help       - Show this help message
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        }
    },
    about: {
        description: 'Display about section',
        execute: () => {
            showPanel('about');
            return '[SUCCESS] Loaded about section';
        }
    },
    skills: {
        description: 'Display skills section',
        execute: () => {
            showPanel('skills');
            return '[SUCCESS] Loaded skills section';
        }
    },
    projects: {
        description: 'Display projects section',
        execute: () => {
            showPanel('projects');
            return '[SUCCESS] Loaded projects section';
        }
    },
    contact: {
        description: 'Display contact section',
        execute: () => {
            showPanel('contact');
            return '[SUCCESS] Loaded contact section';
        }
    },
    clear: {
        description: 'Clear terminal',
        execute: () => {
            terminalOutput.innerHTML = '';
            hideAllPanels();
            return '';
        }
    },
    search: {
        description: 'Search content',
        execute: (args) => {
            if (!args || args.length === 0) {
                return '[ERROR] Usage: search [term]';
            }
            const term = args.join(' ').toLowerCase();
            const results = searchContent(term);
            if (results.length === 0) {
                return `[SEARCH] No results found for "${term}"`;
            }
            return `[SEARCH] Found ${results.length} result(s) for "${term}":\n${results.join('\n')}`;
        }
    }
};

function searchContent(term) {
    const results = [];
    const sections = ['about', 'skills', 'projects', 'contact'];
    
    sections.forEach(section => {
        const panel = document.getElementById(section);
        const text = panel.textContent.toLowerCase();
        if (text.includes(term)) {
            results.push(`  ▸ Found in ${section.toUpperCase()} section`);
        }
    });
    
    return results;
}

function showPanel(panelId) {
    hideAllPanels();
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.remove('hidden');
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function hideAllPanels() {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => panel.classList.add('hidden'));
}

function addOutput(text, type = 'normal') {
    const lines = text.split('\n');
    lines.forEach(line => {
        if (line.trim()) {
            const div = document.createElement('div');
            div.className = `output-line ${type}`;
            div.textContent = line;
            terminalOutput.appendChild(div);
        }
    });
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function processCommand(input) {
    const parts = input.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    addOutput(`root@kapalit:~$ ${input}`);
    
    if (!cmd) return;
    
    if (commands[cmd]) {
        const result = commands[cmd].execute(args);
        if (result) {
            const type = result.includes('[ERROR]') ? 'error' : 
                        result.includes('[SUCCESS]') ? 'success' : 'normal';
            addOutput(result, type);
        }
    } else {
        addOutput(`[ERROR] Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
    }
}

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = terminalInput.value;
        processCommand(input);
        terminalInput.value = '';
    }
});

// Auto-focus terminal input
document.addEventListener('click', (e) => {
    if (!e.target.closest('.panel')) {
        terminalInput.focus();
    }
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        addOutput('[SYSTEM] Access granted. Elite hacker mode activated! 🔓', 'success');
        document.body.style.animation = 'hueRotate 3s infinite';
    }
});

// Initial welcome animation
setTimeout(() => {
    addOutput('[SYSTEM] All systems operational', 'success');
    addOutput('[SYSTEM] Security protocols active', 'success');
}, 500);
