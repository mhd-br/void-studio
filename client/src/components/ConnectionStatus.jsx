import { Wifi, WifiOff, Users, User, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { useCollaboration } from '../hooks/useCollaboration';
import useCanvasStore from '../store/useCanvasStore';
import UsernameModal from './UsernameModal';
import '../styles/ConnectionStatus.css';

export default function ConnectionStatus() {
  const { projectId } = useCanvasStore();
  const userName = localStorage.getItem('void-studio-username') || '';
  const { isConnected, users } = useCollaboration(projectId, userName);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  if (!projectId) return null;
  
  const handleUsernameChange = (name) => {
    localStorage.setItem('void-studio-username', name);
    setShowUsernameModal(false);
    window.location.reload();
  };
  
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/?room=${projectId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <>
      <div className="connection-status">
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        
        {isConnected && users.length > 0 && (
          <div className="active-users">
            <Users size={16} />
            <span>{users.length} {users.length === 1 ? 'user' : 'users'} online</span>
          </div>
        )}
        
        <button 
          className="username-button"
          onClick={() => setShowUsernameModal(true)}
          title="Change username"
        >
          <User size={16} />
          <span>{userName || 'Set Name'}</span>
        </button>
        
        <button 
          className={`share-button ${copied ? 'copied' : ''}`}
          onClick={handleShare}
          title="Copy share link"
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          <span>{copied ? 'Copied!' : 'Share'}</span>
        </button>
      </div>
      
      {showUsernameModal && (
        <UsernameModal 
          onSubmit={handleUsernameChange}
          currentName={userName}
        />
      )}
    </>
  );
}