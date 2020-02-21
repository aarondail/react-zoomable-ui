import * as React from 'react';
import { Space } from 'react-zoomable-ui';

import mountain from './mountain.jpg';

export const ZoomableImagesDemo = () => {
  const renderImageArea = () => (
    <div style={{ width: 300, height: 300, position: 'relative' }}>
      <Space
        style={{ border: 'solid 1px black', margin: 20 }}
        onCreate={vp => {
          vp.setBounds({ x: [0, 1280], y: [0, 960] });
          vp.camera.centerFitAreaIntoView({
            left: 0,
            top: 0,
            width: 1280,
            height: 960,
          });
        }}
      >
        <img src={mountain} width={1280} height={960} alt="A Mountain" />
      </Space>
    </div>
  );
  return (
    <div>
      <div style={{ display: 'flex', paddingTop: 80, justifyContent: 'center' }}>
        {renderImageArea()}
        {renderImageArea()}
        {renderImageArea()}
      </div>
    </div>
  );
};
