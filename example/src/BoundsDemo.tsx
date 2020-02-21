import * as React from 'react';
import { Space, ViewPort } from 'react-zoomable-ui';

// This demonstrates constraining the ViewPort to a fixed size. The Space's
// contents will be zoomed in automatically so that the boundary is honored.

const initViewPort = (vp: ViewPort) => {
  vp.setBounds({ x: [0, 400], y: [0, 200] });
};

export const BoundsDemo = () => {
  return (
    <Space onCreate={initViewPort}>
      <div style={boundaryDivStyle}>
        <span>
          This box is 200px by 200px wide, but the view port bounds are x: 0 to 400, and y 0 to 200. That means the view
          port has to zoom in to fix the box within the bounds, and you can pan a bit left to right but not up to down,
          unless you zoom in some more.
        </span>
      </div>
    </Space>
  );
};

const boundaryDivStyle: React.CSSProperties = {
  width: 200,
  height: 200,
  left: 0,
  top: 0,
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  border: 'solid 2px red',
  boxSizing: 'border-box',
  color: 'red',
  backgroundColor: '#cef',
  backgroundPosition: '0 0, 15px 15px',
  backgroundSize: '30px 30px',
  backgroundImage:
    'linear-gradient( 45deg, #CCC 25%, transparent 25%, transparent 75%, #CCC 75%, #CCC), linear-gradient( 45deg, #CCC 25%, transparent 25%, transparent 75%, #CCC 75%, #CCC)',
};
