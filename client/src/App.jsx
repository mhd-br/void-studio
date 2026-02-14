import { useEffect } from 'react';
import Canvas3D from './components/canvas/Canvas3D';
import Toolbar from './components/panels/Toolbar';
import LayerPanel from './components/panels/LayerPanel';
import PropertiesPanel from './components/panels/PropertiesPanel';
import ConnectionStatus from './components/ConnectionStatus';
import useCanvasStore from './store/useCanvasStore';
import { getCurrentProjectId, loadProject, createNewProject, saveProject } from './utils/storage';
import './styles/App.css';

export default function App() {
  const { loadProjectData, setProjectId } = useCanvasStore();
  
  // Load last project on mount
  useEffect(() => {
    // Check for room parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    
    if (roomParam) {
      // Join shared room
      const project = loadProject(roomParam);
      if (project) {
        loadProjectData(project);
      } else {
        // Room doesn't exist locally, create placeholder
        const newProject = createNewProject('Shared Project');
        newProject.id = roomParam; // Use room ID from URL
        saveProject(newProject);
        loadProjectData(newProject);
      }
    } else {
      // Normal flow - load last project
      const currentId = getCurrentProjectId();
      
      if (currentId) {
        const project = loadProject(currentId);
        if (project) {
          loadProjectData(project);
        } else {
          const newProject = createNewProject();
          saveProject(newProject);
          setProjectId(newProject.id);
        }
      } else {
        const newProject = createNewProject('My First Project');
        saveProject(newProject);
        setProjectId(newProject.id);
      }
    }
  }, []);
  
  return (
    <div className="app">
      <ConnectionStatus />
      <Toolbar />
      <LayerPanel />
      <div className="canvas-container">
        <Canvas3D />
      </div>
      <PropertiesPanel />
    </div>
  );
}