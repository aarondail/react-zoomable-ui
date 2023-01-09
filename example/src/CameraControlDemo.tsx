import * as React from 'react';
import { Space } from 'react-zoomable-ui';

// This demonstrates pragmatically manipulating the ViewPortCamera.

export const CameraControlDemo = () => {
  const spaceRef = React.useRef<Space | null>(null);
  return (
    <React.Fragment>
      <Space ref={spaceRef} style={{ backgroundColor: 'black' }} onCreate={(vp) => vp.camera.recenter(100, 100, 2)}>
        <div
          style={{
            width: 200,
            height: 200,
            left: 0,
            top: 0,
            backgroundColor: 'blue',
          }}
        ></div>
      </Space>
      {/* The camera control panel */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 20,
        }}
      >
        <div
          style={{
            position: 'relative',
            left: '-50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#6666',
            padding: 20,
            borderRadius: 14,
          }}
        >
          <div style={{ color: 'white', marginBottom: 5 }}>Camera Control</div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <button style={buttonStyle} onClick={() => spaceRef.current?.viewPort?.camera.moveBy(0, 0, 0.1)}>
              +
            </button>
            <button style={buttonStyle} onClick={() => spaceRef.current?.viewPort?.camera.moveBy(0, 0, -0.1)}>
              −
            </button>
          </div>
          <div>
            <button
              style={buttonStyle}
              onClick={() =>
                spaceRef.current?.viewPort?.camera.moveBy(0, -20, 0, undefined, undefined, {
                  durationMilliseconds: 500,
                })
              }
            >
              ⇧
            </button>
          </div>
          <div>
            <button style={buttonStyle} onClick={() => spaceRef.current?.viewPort?.camera.moveBy(0, -5)}>
              ↑
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <button
              style={buttonStyle}
              onClick={() =>
                spaceRef.current?.viewPort?.camera.moveBy(-20, 0, 0, undefined, undefined, {
                  durationMilliseconds: 500,
                })
              }
            >
              ⇦
            </button>
            <button style={buttonStyle} onClick={() => spaceRef.current?.viewPort?.camera.moveBy(-5, 0)}>
              ←
            </button>
            <div style={buttonStyle} />
            <button style={buttonStyle} onClick={() => spaceRef.current?.viewPort?.camera.moveBy(5, 0)}>
              →
            </button>
            <button
              style={buttonStyle}
              onClick={() =>
                spaceRef.current?.viewPort?.camera.moveBy(20, 0, 0, undefined, undefined, {
                  durationMilliseconds: 500,
                })
              }
            >
              ⇨
            </button>
          </div>
          <div>
            <button style={buttonStyle} onClick={() => spaceRef.current?.viewPort?.camera.moveBy(0, 5)}>
              ↓
            </button>
          </div>
          <div>
            <button
              style={buttonStyle}
              onClick={() =>
                spaceRef.current?.viewPort?.camera.moveBy(0, 20, 0, undefined, undefined, {
                  durationMilliseconds: 500,
                })
              }
            >
              ⇩
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const buttonStyle = {
  width: 30,
  height: 30,
  fontSize: 16,
};
