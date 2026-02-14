import { useState } from 'react';
import { User } from 'lucide-react';
import '../styles/UsernameModal.css';

export default function UsernameModal({ onSubmit, currentName }) {
  const [name, setName] = useState(currentName || '');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };
  
  return (
    <div className="username-modal-overlay">
      <div className="username-modal">
        <div className="username-header">
          <User size={32} />
          <h2>Enter Your Name</h2>
          <p>This name will be visible to other collaborators</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name..."
            className="username-input"
            autoFocus
            maxLength={20}
          />
          
          <button 
            type="submit" 
            className="username-submit"
            disabled={!name.trim()}
          >
            Start Collaborating
          </button>
        </form>
      </div>
    </div>
  );
}