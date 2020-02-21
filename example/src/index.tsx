import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, NavLink, Route, Switch } from 'react-router-dom';
import { suppressBrowserZooming }  from 'react-zoomable-ui';

import './index.css';

import { BoundsDemo } from './BoundsDemo';
import { CameraControlDemo } from './CameraControlDemo';
import { LargeAreaDemo } from './LargeAreaDemo';
import { LongPageDemo } from './LongPageDemo';
import { LowLevelEventsDemo } from './LowLevelEventsDemo';
import { OverviewDemo } from './OverviewDemo';
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
          <NavLink to="/overview" activeClassName="active">
            Overview
          </NavLink>{' '}
          <NavLink to="/zoomableImages" activeClassName="active">
            Zoomable Images
          </NavLink>{' '}
          <NavLink to="/largeArea" activeClassName="active">
            Large Area
          </NavLink>{' '}
          <NavLink to="/longPage" activeClassName="active">
            Long Page
          </NavLink>{' '}
          <NavLink to="/cameraControl" activeClassName="active">
            Camera Control
          </NavLink>{' '}
          <NavLink to="/bounds" activeClassName="active">
            Bounds
          </NavLink>{' '}
          <NavLink to="/lowLevelEvents" activeClassName="active">
            Low Level Events
          </NavLink>{' '}
        </nav>
        {/* Note the position: 'relative' here */}
        <div style={{ flexGrow: 1, position: 'relative' }}>
          <Switch>
            <Route path="/zoomableImages">
              <ZoomableImagesDemo />
            </Route>
            <Route path="/largeArea">
              <LargeAreaDemo />
            </Route>
            <Route path="/longPage">
              <LongPageDemo />
            </Route>
            <Route path="/cameraControl">
              <CameraControlDemo />
            </Route>
            <Route path="/bounds">
              <BoundsDemo />
            </Route>
            <Route path="/lowLevelEvents">
              <LowLevelEventsDemo />
            </Route>
            <Route>
              <OverviewDemo />
            </Route>
          </Switch>
        </div>
        <div className="bottom" style={{ backgroundColor: '#0bf9', height: 30 }}></div>
      </HashRouter>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
