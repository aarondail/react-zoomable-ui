# React Zoomable UI

Make your HTML elements and [React](https://reactjs.com) components zoomable, and build interesting zoomable UIs. Supports zooming and panning via touch and mouse interactions.

## Features

- Make your whole page zoomable and pan-able, or just part of it.
- The zoomable space can be as large as you want, or bounded (x, y, and/or zoom).
- Has events for different interactions, letting you control how the library responds to mouse clicks and touches.
- Includes basic components that can distinguish, in a nuanced way, between panning, tapping, and long-tapping. These can also be used to implement more advanced interactions like dragging.
- Has TypeScript types.
- Supports animations.
- Technically can be used w/o React.

## Browser Support

Tested and works on:

- Desktop Chrome, Firefox, Safari.
- Mobile Chrome, and Mobile Safari.
- Tested w/ a mouse, but not touch, on pre-Chromium Edge.

Not tested on, but ideally should work:

- post-Chromium Edge, mouse and touch
- pre-Chromium Edge, touch

Not supported:

- IE 11 and below
- Anything else not mentioned

Please send me issues if you run into problems.

## Examples

TODO

## Basic Usage

### Making your entire page zoomable

```css
html,
body,
#root {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
#root {
  position: relative;
}
```

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Space } from 'react-zoomable-ui';

function App() {
  return (
    <Space>
      <h1>Howdy</h1>
      <div>Try panning an zooming</div>
    </Space>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```

### Making one area zoomable

```javascript
import { Space } from 'react-zoomable-ui';

import mountain from "./mountain.jpg";

const imageWidth = 1280;
const imageHeight = 960;

function ZoomableImage() {
  return (
    <div style={{ width: 300, height: 300, position: "relative" }}>
      <Space
        style={{ border: "solid 1px black" }}
        onCreate={viewPort => {
          viewPort.setBounds({ x: [0, imageWidth], y: [0, imageHeight] });
          viewPort.camera.centerFitAreaIntoView({
            left: 0,
            top: 0,
            width: imageWidth,
            height: imageHeight
          });
        }}
      >
        <img src={mountain} width={imageWidth} height={imageHeight} alt="A Mountain" />
      </Zoomable.Space>
    </div>
```

## Documentation

- [Guide](docs/Guide.md)
- [API](docs/api/API.md)

## License

[MIT](LICENSE)
