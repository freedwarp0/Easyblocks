const BLOCK_LIBRARY = {
  Events: [
    {
      id: 'onStart',
      label: 'при запуске',
      type: 'event',
      code: 'onStart()',
      templates: {
        python: 'def on_start():\n    pass',
        cpp: 'void onStart() {\n    // code\n}',
        rust: 'fn on_start() {\n    // code\n}',
        js: 'function onStart() {\n  // code\n}'
      }
    },
    {
      id: 'onTap',
      label: 'при касании',
      type: 'event',
      code: 'onTap()',
      templates: {
        python: 'def on_tap():\n    pass',
        cpp: 'void onTap() {\n    // code\n}',
        rust: 'fn on_tap() {\n    // code\n}',
        js: 'function onTap() {\n  // code\n}'
      }
    },
    {
      id: 'loop',
      label: 'цикл',
      type: 'control',
      code: 'repeat(10) { ... }',
      templates: {
        python: 'for _ in range(10):\n    pass',
        cpp: 'for (int i = 0; i < 10; ++i) {\n    // code\n}',
        rust: 'for _ in 0..10 {\n    // code\n}',
        js: 'for (let i = 0; i < 10; i++) {\n  // code\n}'
      }
    }
  ],
  Motion: [
    {
      id: 'move',
      label: 'двигаться',
      type: 'motion',
      code: 'move(10)',
      templates: {
        python: 'move(10)',
        cpp: 'move(10);',
        rust: 'move(10);',
        js: 'move(10);'
      }
    },
    {
      id: 'turn',
      label: 'повернуть',
      type: 'motion',
      code: 'turn(90)',
      templates: {
        python: 'turn(90)',
        cpp: 'turn(90);',
        rust: 'turn(90);',
        js: 'turn(90);'
      }
    },
    {
      id: 'jump',
      label: 'прыжок',
      type: 'motion',
      code: 'jump(20)',
      templates: {
        python: 'jump(20)',
        cpp: 'jump(20);',
        rust: 'jump(20);',
        js: 'jump(20);'
      }
    }
  ],
  Looks: [
    {
      id: 'say',
      label: 'сказать',
      type: 'look',
      code: 'say("Привет!")',
      templates: {
        python: 'say("Привет!")',
        cpp: 'say("Привет!");',
        rust: 'say("Привет!");',
        js: 'say("Привет!");'
      }
    },
    {
      id: 'show',
      label: 'показать',
      type: 'look',
      code: 'show()',
      templates: {
        python: 'show()',
        cpp: 'show();',
        rust: 'show();',
        js: 'show();'
      }
    },
    {
      id: 'hide',
      label: 'скрыть',
      type: 'look',
      code: 'hide()',
      templates: {
        python: 'hide()',
        cpp: 'hide();',
        rust: 'hide();',
        js: 'hide();'
      }
    }
  ],
  Logic: [
    {
      id: 'if',
      label: 'если',
      type: 'logic',
      code: 'if (condition) { ... }',
      templates: {
        python: 'if condition:\n    pass',
        cpp: 'if (condition) {\n    // code\n}',
        rust: 'if condition {\n    // code\n}',
        js: 'if (condition) {\n  // code\n}'
      }
    },
    {
      id: 'wait',
      label: 'ждать',
      type: 'logic',
      code: 'wait(1)',
      templates: {
        python: 'wait(1)',
        cpp: 'wait(1);',
        rust: 'wait(1);',
        js: 'wait(1);'
      }
    }
  ]
};

const STORAGE_KEY = 'pocket-up-web-projects';
const CUSTOM_BLOCKS_KEY = 'pocket-up-web-custom-blocks';

const state = {
  projects: [],
  activeProjectId: null,
  customBlocks: [],
  selectedLanguage: 'python',
  blockCounter: 1
};

const elements = {
  projectList: document.getElementById('projectList'),
  workspace: document.getElementById('workspace'),
  palette: document.getElementById('palette'),
  codePreview: document.getElementById('codePreview'),
  currentProjectName: document.getElementById('currentProjectName'),
  emptyState: document.getElementById('emptyState'),
  newProjectBtn: document.getElementById('newProjectBtn'),
  saveBtn: document.getElementById('saveBtn'),
  addProjectBtn: document.getElementById('addProjectBtn'),
  copyCodeBtn: document.getElementById('copyCodeBtn')
};

function createProject(name = `Project ${state.projects.length + 1}`) {
  const project = {
    id: crypto.randomUUID(),
    name,
    blocks: []
  };

  state.projects.push(project);
  state.activeProjectId = project.id;
  saveProjects();
  render();
}

function loadCustomBlocks() {
  const raw = localStorage.getItem(CUSTOM_BLOCKS_KEY);
  if (!raw) {
    state.customBlocks = [];
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    state.customBlocks = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Invalid custom blocks storage', error);
    state.customBlocks = [];
  }
}

function saveCustomBlocks() {
  localStorage.setItem(CUSTOM_BLOCKS_KEY, JSON.stringify(state.customBlocks));
}

function loadProjects() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    createProject('Project 1');
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    state.projects = Array.isArray(parsed) ? parsed : [];
    if (state.projects.length === 0) {
      createProject('Project 1');
      return;
    }
    state.activeProjectId = state.projects[0].id;
  } catch (error) {
    console.error('Invalid storage data', error);
    state.projects = [];
    createProject('Project 1');
  }
}

function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.projects));
}

function currentProject() {
  return state.projects.find((project) => project.id === state.activeProjectId) || state.projects[0];
}

function renderProjects() {
  elements.projectList.innerHTML = '';

  state.projects.forEach((project) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `project-item ${project.id === state.activeProjectId ? 'active' : ''}`;
    item.innerHTML = `
      <div class="name">${project.name}</div>
      <div class="meta">${project.blocks.length} блоков</div>
    `;
    item.addEventListener('click', () => {
      state.activeProjectId = project.id;
      render();
    });
    elements.projectList.appendChild(item);
  });
}

function renderPalette() {
  elements.palette.innerHTML = '';

  const allGroups = { ...BLOCK_LIBRARY };
  if (state.customBlocks.length > 0) {
    allGroups.Custom = state.customBlocks.map((block) => ({
      ...block,
      type: block.category || 'custom',
      label: block.name
    }));
  }

  Object.entries(allGroups).forEach(([group, blocks]) => {
    const groupLabel = document.createElement('div');
    groupLabel.textContent = group;
    groupLabel.style.color = '#a8d7ea';
    groupLabel.style.fontWeight = '700';
    groupLabel.style.marginTop = '10px';
    elements.palette.appendChild(groupLabel);

    blocks.forEach((block) => {
      const item = document.createElement('div');
      item.className = 'palette-item';
      item.draggable = true;
      item.dataset.blockId = block.id;
      item.innerHTML = `
        <div class="label">${block.label}</div>
        <div class="meta">${block.type}</div>
      `;

      item.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(block));
      });

      elements.palette.appendChild(item);
    });
  });
}

function renderBlocks() {
  const project = currentProject();
  if (!project) return;

  elements.workspace.innerHTML = '';
  elements.currentProjectName.textContent = project.name;

  if (project.blocks.length === 0) {
    elements.workspace.appendChild(elements.emptyState);
    return;
  }

  project.blocks.forEach((block) => {
    const card = document.createElement('div');
    card.className = 'block-card';
    card.draggable = true;
    card.dataset.blockId = block.id;
    card.innerHTML = `
      <div class="block-main">
        <span class="block-tag">${block.type}</span>
        <span>${block.label}</span>
      </div>
      <div class="block-actions">
        <button class="copy-btn" type="button">copy</button>
        <button class="remove-btn" type="button">x</button>
      </div>
    `;

    card.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', JSON.stringify({ action: 'move', blockId: block.id }));
    });

    card.querySelector('.remove-btn').addEventListener('click', () => {
      project.blocks = project.blocks.filter((item) => item.id !== block.id);
      saveProjects();
      render();
    });

    card.querySelector('.copy-btn').addEventListener('click', () => {
      const copy = { ...block, id: `block-${Date.now()}-${Math.random().toString(16).slice(2)}` };
      project.blocks.push(copy);
      saveProjects();
      render();
    });

    elements.workspace.appendChild(card);
  });
}

function resolveTemplate(block, language) {
  if (block.templates && block.templates[language]) {
    return block.templates[language];
  }

  if (block.languageTemplates && block.languageTemplates[language]) {
    return block.languageTemplates[language];
  }

  if (typeof block.code === 'string') {
    return block.code;
  }

  return `${block.label || 'block'}();`;
}

function renderCode() {
  const project = currentProject();
  if (!project) {
    elements.codePreview.textContent = 'Нет проекта';
    return;
  }

  const lines = project.blocks.map((block) => {
    const template = resolveTemplate(block, state.selectedLanguage);
    return `// ${block.label || block.name}\n${template};`;
  });

  const defaultBody = {
    python: 'def on_start():\n    pass',
    cpp: 'int main() {\n    return 0;\n}',
    rust: 'fn main() {\n    println!("Pocket Up");\n}',
    js: 'function main() {\n  console.log("Pocket Up");\n}'
  };

  elements.codePreview.textContent = lines.length
    ? lines.join('\n\n')
    : defaultBody[state.selectedLanguage] || defaultBody.python;
}

function attachWorkspaceDrop() {
  elements.workspace.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  elements.workspace.addEventListener('drop', (event) => {
    event.preventDefault();
    try {
      const raw = event.dataTransfer.getData('text/plain');
      const payload = JSON.parse(raw);

      const project = currentProject();
      if (!project) return;

      if (payload && payload.id) {
        const block = {
          ...payload,
          id: `block-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          label: payload.label || 'custom block'
        };
        project.blocks.push(block);
        saveProjects();
        render();
      }
    } catch (error) {
      console.error('drop error', error);
    }
  });
}

function render() {
  renderProjects();
  renderPalette();
  renderBlocks();
  renderCode();
}

function bindActions() {
  elements.newProjectBtn.addEventListener('click', () => {
    const name = `Project ${state.projects.length + 1}`;
    createProject(name);
  });

  elements.addProjectBtn.addEventListener('click', () => {
    const name = `Project ${state.projects.length + 1}`;
    createProject(name);
  });

  elements.saveBtn.addEventListener('click', () => {
    saveProjects();
    saveCustomBlocks();
    alert('Проект сохранён');
  });

  elements.copyCodeBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(elements.codePreview.textContent);
      alert('Код скопирован');
    } catch (error) {
      console.error('Copy failed', error);
    }
  });

  document.querySelectorAll('.lang-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedLanguage = button.dataset.lang;
      document.querySelectorAll('.lang-btn').forEach((item) => item.classList.toggle('active', item === button));
      renderCode();
    });
  });

  document.getElementById('addCustomBlockBtn').addEventListener('click', () => {
    document.getElementById('customBlockModal').classList.remove('hidden');
  });

  document.getElementById('closeCustomBlockModal').addEventListener('click', () => {
    document.getElementById('customBlockModal').classList.add('hidden');
  });

  document.getElementById('cancelCustomBlock').addEventListener('click', () => {
    document.getElementById('customBlockModal').classList.add('hidden');
  });

  document.getElementById('customBlockForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const name = data.get('name').toString().trim();
    const category = data.get('category').toString().trim() || 'Custom';

    if (!name) {
      return;
    }

    const block = {
      id: `custom-${Date.now()}`,
      name,
      label: name,
      type: category,
      category,
      languageTemplates: {
        python: data.get('pythonTemplate').toString().trim(),
        cpp: data.get('cppTemplate').toString().trim(),
        rust: data.get('rustTemplate').toString().trim(),
        js: data.get('jsTemplate').toString().trim()
      }
    };

    state.customBlocks.push(block);
    saveCustomBlocks();
    form.reset();
    document.getElementById('customBlockModal').classList.add('hidden');
    render();
  });
}

loadCustomBlocks();
loadProjects();
attachWorkspaceDrop();
bindActions();
render();
