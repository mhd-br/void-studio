import { useState } from 'react';
import { X, Plus, FolderOpen, Trash2, Download, Clock } from 'lucide-react';
import { getAllProjects, loadProject, deleteProject, createNewProject, saveProject } from '../utils/storage';
import useCanvasStore from '../store/useCanvasStore';
import '../styles/ProjectsModal.css';

export default function ProjectsModal({ onClose }) {
  const [projects, setProjects] = useState(getAllProjects());
  const { loadProjectData, resetProject, getCurrentProjectState, setProjectId, projectId } = useCanvasStore();
  
  const refreshProjects = () => {
    setProjects(getAllProjects());
  };
  
  const handleNewProject = () => {
    const newProject = createNewProject();
    saveProject(newProject);
    resetProject();
    setProjectId(newProject.id);
    refreshProjects();
    onClose();
  };
  
  const handleLoadProject = (id) => {
    const project = loadProject(id);
    if (project) {
      loadProjectData(project);
      onClose();
    }
  };
  
  const handleDeleteProject = (e, id) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
      refreshProjects();
      
      // If deleted current project, reset
      if (id === projectId) {
        resetProject();
      }
    }
  };
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) return 'Just now';
    
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than 1 day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Less than 1 week
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString();
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content projects-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Projects</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <button className="new-project-btn" onClick={handleNewProject}>
            <Plus size={20} />
            New Project
          </button>
          
          {projects.length === 0 ? (
            <div className="empty-projects">
              <FolderOpen size={48} />
              <p>No projects yet</p>
              <p className="empty-hint">Create your first project to get started</p>
            </div>
          ) : (
            <div className="projects-list">
              {projects.sort((a, b) => b.updatedAt - a.updatedAt).map((project) => (
                <div 
                  key={project.id} 
                  className={`project-item ${project.id === projectId ? 'active' : ''}`}
                  onClick={() => handleLoadProject(project.id)}
                >
                  <div className="project-info">
                    <div className="project-name">{project.name}</div>
                    <div className="project-meta">
                      <span className="project-layers">
                        {project.layers.length} layer{project.layers.length !== 1 ? 's' : ''}
                      </span>
                      <span className="project-time">
                        <Clock size={12} />
                        {formatDate(project.updatedAt)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    className="project-delete"
                    onClick={(e) => handleDeleteProject(e, project.id)}
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <div className="storage-info">
            {projects.length} project{projects.length !== 1 ? 's' : ''} saved locally
          </div>
        </div>
      </div>
    </div>
  );
}