import { Html } from '@react-three/drei';
import '../styles/RemoteCursor.css';

export default function RemoteCursor({ user }) {
  return (
    <group position={[user.cursor.x, user.cursor.y, 1]}>
      <Html center>
        <div className="remote-cursor" style={{ borderColor: user.color }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={user.color}>
            <path d="M5 3L19 12L12 13L9 19L5 3Z" />
          </svg>
          <div className="cursor-label" style={{ backgroundColor: user.color }}>
            {user.name}
          </div>
        </div>
      </Html>
    </group>
  );
}