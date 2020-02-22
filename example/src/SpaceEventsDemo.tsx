import * as React from 'react';
import { PressEventCoordinates, PressHandlingOptions, Space, ViewPort } from 'react-zoomable-ui';

// This demonstrates how you can use the interaction events on the Space without
// using the Pressable component.

const initViewPort = (vp: ViewPort) => {
  vp.camera.recenter(100, 100, 2);
};

const formatCoordsAsString = (p?: PressEventCoordinates) => {
  return p === undefined
    ? '-'
    : `virtual: ${p.x.toFixed(1)}, ${p.y.toFixed(1)}, client: ${p.clientX.toFixed(1)}, ${p.clientY.toFixed(1)}`;
};

export const SpaceEventsDemo = () => {
  const r = React.useRef<Space | null>(null);
  const [pressStart, setPressStart] = React.useState();
  const [hover, setHover] = React.useState();
  const [pressContextMenu, setPressContextMenu] = React.useState();
  const [pressMoveIfCaptured, setPressMoveIfCaptured] = React.useState();
  return (
    <Space
      ref={r}
      style={{ backgroundColor: 'black' }}
      onCreate={initViewPort}
      onDecideHowToHandlePress={(element, coords): PressHandlingOptions | undefined => {
        setPressStart(coords);

        // Get id of element or nearest ancestor with an id
        let id;
        let y = element.target as any;
        while (!id && element) {
          id = y.id;
          if (!id) {
            y = y.parentElement;
          }
        }

        if (id === 'prevent_drag') {
          return { ignorePressEntirely: true };
        } else if (id === 'capture_press') {
          return {
            capturePressThresholdMs: 0,
            onCapturePressMove: c => setPressMoveIfCaptured(c),
          };
        }
        return undefined;
      }}
      onHover={(e, c) => setHover(c)}
      onPressContextMenu={(e, c) => setPressContextMenu(c)}
    >
      <div
        style={{
          width: 200,
          height: 200,
          left: 0,
          top: 0,
          backgroundColor: '#FFF',
          fontSize: 10,
        }}
      >
        <div>
          Press Start:
          <br />
          <small>{formatCoordsAsString(pressStart)}</small>
        </div>
        <br />
        <div>
          Hover:
          <br /> <small>{formatCoordsAsString(hover)}</small>
        </div>

        <br />
        <div>
          Press Context Menu:
          <br /> <small>{formatCoordsAsString(pressContextMenu)}</small>
        </div>
        <br />
        <div>
          Press Move (if captured):
          <br /> <small>{formatCoordsAsString(pressMoveIfCaptured)}</small>
        </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            id="capture_press"
            style={{
              width: 100,
              backgroundColor: 'red',
              padding: 4,
              paddingBottom: 6,
              borderRadius: 2,
              margin: 10,
            }}
          >
            <small>CAPTURE PRESS TEST</small>
          </div>
          <br />
          <div
            id="prevent_drag"
            style={{
              width: 100,
              backgroundColor: 'orange',
              padding: 4,
              paddingBottom: 6,
              borderRadius: 2,
              margin: 10,
            }}
          >
            <small>PREVENT DRAG TEST</small>
          </div>
        </div>
      </div>
    </Space>
  );
};
