import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import { suppressBrowserZooming } from 'react-zoomable-ui';

import './index.css';

import { BoundsDemo } from './BoundsDemo';
import { CameraControlDemo } from './CameraControlDemo';
import { LargeAreaDemo } from './LargeAreaDemo';
import { LongPageDemo } from './LongPageDemo';
import { OverviewDemo } from './OverviewDemo';
import { SpaceEventsDemo } from './SpaceEventsDemo';
import { ZoomableImagesDemo } from './ZoomableImagesDemo';

function App() {
  React.useEffect(suppressBrowserZooming);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <HashRouter>
        <nav
          style={{
            backgroundColor: '#0bf9',
            padding: '5px 10px',
          }}
        >
          <NavLink to="/overview" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Overview
          </NavLink>{' '}
          <NavLink to="/zoomableImages" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Zoomable Images
          </NavLink>{' '}
          <NavLink to="/largeArea" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Large Area
          </NavLink>{' '}
          <NavLink to="/longPage" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Long Page
          </NavLink>{' '}
          <NavLink to="/cameraControl" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Camera Control
          </NavLink>{' '}
          <NavLink to="/bounds" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Bounds
          </NavLink>{' '}
          <NavLink to="/spaceEvents" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Space Events
          </NavLink>{' '}
        </nav>
        {/* Note the position: 'relative' here */}
        <div style={{ flexGrow: 1, position: 'relative' }}>
          <Routes>
            <Route path="/zoomableImages" element={<ZoomableImagesDemo />} />
            <Route path="/largeArea" element={<LargeAreaDemo />} />
            <Route path="/longPage" element={<LongPageDemo />} />
            <Route path="/cameraControl" element={<CameraControlDemo />} />
            <Route path="/bounds" element={<BoundsDemo />} />
            <Route path="/spaceEvents" element={<SpaceEventsDemo />} />
            <Route path="/overview" element={<OverviewDemo />} />
            <Route index element={<OverviewDemo />} />
          </Routes>
        </div>
        <div className="bottom" style={{ backgroundColor: '#0bf9', height: 30, display: 'flex', alignItems: 'center' }}>
          <a href="https://github.com/aarondail/react-zoomable-ui">https://github.com/aarondail/react-zoomable-ui</a>
        </div>
      </HashRouter>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
