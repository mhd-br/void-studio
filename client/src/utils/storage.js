const STORAGE_PREFIX = 'void-studio-';
const PROJECTS_KEY = `${STORAGE_PREFIX}projects`;
const CURRENT_PROJECT_KEY = `${STORAGE_PREFIX}current-project`;

/**
 * save a project to localStorage
 */
export function saveProject(project) {
  try {
    const projects = getAllProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = {
        ...project,
        updatedAt: Date.now()
      };
    } else {
      projects.push({
        ...project,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
    
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    localStorage.setItem(CURRENT_PROJECT_KEY, project.id);
    
    return true;
  } catch (error) {
    console.error('Failed to save project:', error);
    return false;
  }
}

/**
 * load a project by ID
 */
export function loadProject(projectId) {
  try {
    const projects = getAllProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      localStorage.setItem(CURRENT_PROJECT_KEY, projectId);
    }
    
    return project || null;
  } catch (error) {
    console.error('Failed to load project:', error);
    return null;
  }
}

/**
 * get all saved projects
 */
export function getAllProjects() {
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get projects:', error);
    return [];
  }
}

/**
 * delete a project
 */
export function deleteProject(projectId) {
  try {
    const projects = getAllProjects();
    const filtered = projects.filter(p => p.id !== projectId);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered));
    
    // If deleted project was current, clear current
    const currentId = localStorage.getItem(CURRENT_PROJECT_KEY);
    if (currentId === projectId) {
      localStorage.removeItem(CURRENT_PROJECT_KEY);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete project:', error);
    return false;
  }
}

/**
 * get current project ID
 */
export function getCurrentProjectId() {
  return localStorage.getItem(CURRENT_PROJECT_KEY);
}

/**
 * create a new project with default values
 */
export function createNewProject(name = 'Untitled Project') {
  return {
    id: `project-${Date.now()}`,
    name,
    layers: [],
    voidConfig: {
      preset: 'cosmic',
      color1: [0.05, 0.05, 0.15],
      color2: [0.15, 0.1, 0.3],
      intensity: 1.0
    }
  };
}

/**
 * auto-save current state
 */
export function autoSave(state) {
  const currentId = getCurrentProjectId();
  
  if (currentId) {
    const project = {
      id: currentId,
      name: state.projectName || 'Untitled Project',
      layers: state.layers,
      voidConfig: state.voidConfig
    };
    
    return saveProject(project);
  }
  
  return false;
}

/**
 * get storage size info
 */
export function getStorageInfo() {
  try {
    const projects = getAllProjects();
    const size = new Blob([localStorage.getItem(PROJECTS_KEY) || '']).size;
    
    return {
      projectCount: projects.length,
      sizeKB: (size / 1024).toFixed(2),
      sizeMB: (size / 1024 / 1024).toFixed(2)
    };
  } catch (error) {
    return { projectCount: 0, sizeKB: 0, sizeMB: 0 };
  }
}