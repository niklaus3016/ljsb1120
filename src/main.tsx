import {createRoot} from 'react-dom/client';
import {MotionConfig} from 'motion/react';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

registerSW({immediate: true});

createRoot(document.getElementById('root')!).render(
  <MotionConfig reducedMotion="user">
    <App />
  </MotionConfig>,
);
