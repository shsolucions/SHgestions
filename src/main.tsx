import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ensureDefaultUser } from '@/db/database';
import { seedDemoData } from '@/utils/demoData';
import './index.css';

async function init() {
  await ensureDefaultUser();
  await seedDemoData();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

init().catch(console.error);
