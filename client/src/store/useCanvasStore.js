import { create } from 'zustand';

const useCanvasStore = create((set, get) => ({
  // Project state
  projectId: null,
  projectName: 'Untitled Project',
  
  // Canvas state
  layers: [],
  selectedLayerId: null,
  
  // Void configuration
  voidConfig: {
    preset: 'cosmic',
    color1: [0.05, 0.05, 0.15],
    color2: [0.15, 0.1, 0.3],
    intensity: 1.0
  },
  
  // Tool state
  activeTool: 'select',
  
  // UI state
  showExportMenu: false,
  
  // Project actions
  setProjectId: (id) => set({ projectId: id }),
  
  setProjectName: (name) => set({ projectName: name }),
  
  loadProjectData: (project) => set({
    projectId: project.id,
    projectName: project.name,
    layers: project.layers,
    voidConfig: project.voidConfig,
    selectedLayerId: null
  }),
  
  resetProject: () => set({
    projectId: null,
    projectName: 'Untitled Project',
    layers: [],
    selectedLayerId: null,
    voidConfig: {
      preset: 'cosmic',
      color1: [0.05, 0.05, 0.15],
      color2: [0.15, 0.1, 0.3],
      intensity: 1.0
    }
  }),
  
  // Layer actions
  addLayer: (layer) => set((state) => ({
    layers: [...state.layers, { ...layer, id: Date.now().toString() }],
    selectedLayerId: layer.id
  })),
  
  updateLayer: (id, updates) => set((state) => ({
    layers: state.layers.map(layer =>
      layer.id === id ? { ...layer, ...updates } : layer
    )
  })),
  
  deleteLayer: (id) => set((state) => ({
    layers: state.layers.filter(layer => layer.id !== id),
    selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId
  })),
  
  selectLayer: (id) => set({ selectedLayerId: id }),
  
  setActiveTool: (tool) => set({ activeTool: tool }),
  
  updateVoidConfig: (config) => set((state) => ({
    voidConfig: { ...state.voidConfig, ...config }
  })),
  
  toggleExportMenu: () => set((state) => ({ 
    showExportMenu: !state.showExportMenu 
  })),
  
  closeExportMenu: () => set({ showExportMenu: false }),
  
  // Get selected layer
  getSelectedLayer: () => {
    const state = get();
    return state.layers.find(layer => layer.id === state.selectedLayerId);
  },
  
  // Get current project state for saving
  getCurrentProjectState: () => {
    const state = get();
    return {
      id: state.projectId,
      name: state.projectName,
      layers: state.layers,
      voidConfig: state.voidConfig
    };
  }
}));

export default useCanvasStore;