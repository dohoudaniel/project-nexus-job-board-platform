import { RiseLoader } from 'react-spinners';

export const Loader = () => (
  <RiseLoader
    color="#FFD700"
    margin={4}
    size={10}
    style={{
      position: 'absolute',
      top: '100%',
      left: '100%',
      transform: 'translate(-50%, -50%)',
      zIndex: 13000,
    }}
  />
);