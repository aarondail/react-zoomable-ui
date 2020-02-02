# React Zoomable UI

Make your HTML elements and [React](https://reactjs.com) components zoomable, and build interesting zoomable UIs. Supports zooming and panning via touch and mouse interactions.

## Features

- Make your whole page zoomable or just part of it.
- Tested against all modern browsers, including mobile Safari and mobile Chrome... except for IE/Edge (TODO).
- Has basic interactive components that can distinguish easily between panning, tapping, and long-tapping. These can also be used to implement more advanced interactions like dragging.
- Has TypeScript types.
- Technically can be used w/o React.

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

## Installation

react-zoomable-ui requires React 16.3 or later.

```
npm install --save react-zoomable-ui
```

```
yarn add react-zoomable-ui
```

## Documentation

- [Guide](docs/Guide.md)
- [Sizing](docs/Sizing.md)
- [API](docs/API.md)
- [Usage without React](docs/UsageWithoutReact.md)
- [Known Problems](docs/KnownProblems.md)

## License

[MIT](LICENSE)
