import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import useCanvasStore from '../store/useCanvasStore';

const SERVER_URL = 'http://localhost:3001';

export function useCollaboration(roomId, userName) {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [cursors, setCursors] = useState(new Map());
  const [isConnected, setIsConnected] = useState(false);
  
  const { 
    layers, 
    voidConfig, 
    loadProjectData,
    updateLayer: localUpdateLayer,
    addLayer: localAddLayer,
    deleteLayer: localDeleteLayer,
    updateVoidConfig: localUpdateVoidConfig
  } = useCanvasStore();
  
  const isRemoteUpdate = useRef(false);
  
  useEffect(() => {
    if (!roomId || !userName) return;
    
    // Connect to server
    const newSocket = io(SERVER_URL, {
      transports: ['websocket'],
    });
    
    newSocket.on('connect', () => {
      console.log('Connected to collaboration server');
      setIsConnected(true);
      
      // Generate random color for user
      const userColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
      
      // Join room
      newSocket.emit('join-room', {
        roomId,
        user: { name: userName, color: userColor }
      });
    });
    
    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });
    
    // Receive initial room state
    newSocket.on('room-state', (state) => {
      console.log('Received room state:', state);
      isRemoteUpdate.current = true;
      
      if (state.projectId) {
        loadProjectData({
          id: state.projectId,
          name: state.projectName,
          layers: state.layers,
          voidConfig: state.voidConfig
        });
      }
      
      setTimeout(() => {
        isRemoteUpdate.current = false;
      }, 100);
    });
    
    // Receive canvas updates from other users
    newSocket.on('canvas-update', ({ state, userId }) => {
      console.log('Canvas update from:', userId);
      isRemoteUpdate.current = true;
      
      loadProjectData({
        id: state.projectId,
        name: state.projectName,
        layers: state.layers,
        voidConfig: state.voidConfig
      });
      
      setTimeout(() => {
        isRemoteUpdate.current = false;
      }, 100);
    });
    
    // Receive layer operations from other users
    newSocket.on('layer-operation', ({ operation, userId }) => {
      console.log('Layer operation from:', userId, operation);
      isRemoteUpdate.current = true;
      
      switch (operation.type) {
        case 'add':
          localAddLayer(operation.layer);
          break;
        case 'update':
          localUpdateLayer(operation.layerId, operation.updates);
          break;
        case 'delete':
          localDeleteLayer(operation.layerId);
          break;
      }
      
      setTimeout(() => {
        isRemoteUpdate.current = false;
      }, 50);
    });
    
    // Receive void config updates
    newSocket.on('void-update', ({ voidConfig, userId }) => {
      console.log('Void update from:', userId);
      isRemoteUpdate.current = true;
      localUpdateVoidConfig(voidConfig);
      
      setTimeout(() => {
        isRemoteUpdate.current = false;
      }, 50);
    });
    
    // Receive user list updates
    newSocket.on('users-update', (userList) => {
      console.log('Users in room:', userList);
      setUsers(userList.filter(u => u.id !== newSocket.id));
    });
    
    // Receive cursor updates
    newSocket.on('cursor-update', ({ userId, user }) => {
      setCursors(prev => {
        const next = new Map(prev);
        next.set(userId, user);
        return next;
      });
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };
  }, [roomId, userName]);
  
  // Broadcast canvas state changes
  useEffect(() => {
    if (!socket || !roomId || isRemoteUpdate.current) return;
    
    const state = useCanvasStore.getState().getCurrentProjectState();
    
    socket.emit('canvas-update', {
      roomId,
      state
    });
  }, [layers, socket, roomId]);
  
  // Broadcast void config changes
  useEffect(() => {
    if (!socket || !roomId || isRemoteUpdate.current) return;
    
    socket.emit('void-update', {
      roomId,
      voidConfig
    });
  }, [voidConfig, socket, roomId]);
  
  // Send cursor position
  const sendCursorPosition = (position) => {
    if (socket && roomId) {
      socket.emit('cursor-move', {
        roomId,
        position
      });
    }
  };
  
  return {
    isConnected,
    users,
    cursors,
    sendCursorPosition
  };
}