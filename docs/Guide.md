# Guide

This guide will walk you through what you need to know to use React Zoomable UI.

If you want to see example code using the library check out the [example/](https://github.com/aarondail/react-zoomable-ui/tree/master/example) directory. You can see the examples running live [here](https://aarondail.github.io/react-zoomable-ui/example/).

- [Installation](Guide.md#installation)
- [The Space Component](Guide.md#the-Space-component)
- [Sizing](Guide.md#sizing)
- [Layout of Children](Guide.md#layout-of-children)
- [Resizing](Guide.md#resizing)
- [VirtualSpace vs ClientSpace](Guide.md#virtualspace-vs-clientspace)
- [The ViewPort and ViewPortCamera](Guide.md#the-viewport-and-viewportcamera)
- [Setting Bounds](Guide.md#setting-bounds)
- [Preventing Accidental Browser Zooming](Guide.md#preventing-accidental-browser-zooming)
- [Interactions and Pressable](Guide.md#interactions-and-pressable)
- [NoPanArea](Guide.md#nopanarea)
- [Known Issues](Guide.md#known-issues)
- [Complete API Reference](Guide.md#complete-api-reference)

## Installation

React 16.3 or later is required.

Install it via:

```
npm install --save react-zoomable-ui
```

```
yarn add react-zoomable-ui
```

TypeScript types are included with the library.

## The Space Component

To make your HTML elements or other React components zoomable and pan-able, you simply put them inside a `Space` component.

E.g.

```javascript
import { Space } from 'react-zoomable-ui';

function Example() {
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Space>
        <h1>Howdy</h1>
        <div>Try panning an zooming</div>
      </Space>
    </div>
  );
}
```

At a high level, how this works is: the `Space` component renders an outer `div` and an inner `div`, and the `Space`'s children get rendered inside the inner `div`. The `Space` listens for mouse and touch (and other) events on the outer `div` (technically its a `ViewPort` doing the listening, but more about that below), and based on those events it translates (i.e. changes the x,y position) and scales the inner `div`, using CSS transforms. If there was no outer `div`, the inner `div` would just fly around the rest of the page, but the outer `div` is there and basically serves to give the inner `div` a limited area in which to be rendered (by the browser).

#### API Reference

- [Space](api/classes/space.md)

## Sizing

Very important: the outer `div` rendered by the `Space` component is _absolutely positioned_ to take up all available space. This can be overridden (with your own CSS rules or styles) but if you don't do that you probably should make sure its parent element has `position: relative` in its styles. One exception to that would be if you intend for the `Space` to cover the entire page, in which case it doesn't matter.

Also, note that by default the parent element will not get sized based on the `Space` or its children. This means that if the parent's height would be based on its children (e.g. its a simple `<div>` with no other styling), it may end up with a height of 0. In which case the Space will also have a height of 0.

To make sure the parent and the `Space` get a proper height, you can give the parent element a fixed size, use Flexbox, use `height: 100%`, or use any other means to make the parent take up space on its own.

Some tips on sizing:

- If you want to make the `Space` take up all available window space, you can give all its parent element and all its ancestor elements (including the `html` and `body`) `height: 100%`.
- If you want to make the `Space` take up almost all available space except for a top bar, bottom bar, and/or side panel, you can use Flexbox to size the `div`s, and just make sure to add `position: relative` to the (center) `div` that contains the `Space`.
- If you want to make the `Space` take up a fixed amount of space, you can put it in a `div` with a fixed size (and `position: relative`).
  - Alternatively, you can give it a class or style with a fixed size, and `position: static`.
- For sizing to work well, `Space` should probably be the only child of its parent.

## Layout of Children

The children of the `Space` will be laid out, by default, as if they were constrained by the width of the `Space`'s outer `div`. For example, if the `Space` takes up the whole browser window, then the children will be laid out as if they had to fit inside the window's width.

This might be what you want, but it might not.

If you want the children to be laid out over a large fixed size area you have a couple options:

- Wrap the children in a `div` with a fixed size.
- Position the children of the `Space` (the direct children only) using absolute positioning.

# Resizing

In some cases when the element containing the `Space` resizes you may need to notify the `Space`. The `Space` will detect size changes when the browser window itself changes, so if that is the only way for a resize to happen then you don't need to do anything extra.

But if there are other times when the parent element resizes you can either manually tell the `Space` via its `updateSize()` method, or set the `pollForElementResizing` prop to `true`. In the later case, the size will be checked every 500ms or so.

If the `Space` has a stale size, nothing may immediately appear to be wrong but certain behaviors like zooming may behave oddly.

## VirtualSpace vs ClientSpace

You can think of the `Space`'s children as being rendered in a virtual space that is unconstrained by the dimensions of the window/document/page. This contrasts with the client space, which is the space display in the browser window (the top left corner of the document in the browser window is _always_ 0,0... irrespective of scrolling on the page).

The `Space`'s job could be seen conceptually as placing its children into virtual space, then translating the _visible_ portion of that into the client space of the browser window.

That sounds a bit more complicated that maybe its needs to, but it is good to understand because when you are dealing with coordinates you need to know which space they are in.

## The ViewPort and ViewPortCamera

The `Space` creates and manages a lower-level `ViewPort` object that does the heavy lifting of watching for and responding to pans and zooms. It also determines what portion of the virtual space should be visible. You may need to interact with the `ViewPort` to see what the visible portion of the virtual space is (via its properties), or to do things like set the boundaries of the virtual space, translate coordinates from client to virtual space, or get access to the `ViewPortCamera`. The `ViewPortCamera` has methods that let you change the visible portion of the virtual space, with or without animations.

You can get access to the `ViewPort` from the `Space` in a few ways:

- The `viewPort` property on the `Space` instance.
- The `onCreate` and `onUpdated` props on the `Space`.
- Using the `SpaceContext` in any component rendered inside the `Space`.

Also, note that the `ViewPort` can be used by itself without the `Space`, and technically without `React`, if you want to do something more custom with your rendering (e.g. canvas or WebGL). You just construct a new `ViewPort` with a `div` that is the area in which rendering should happen, and it will listen for events on it and track what portion of the virtual space should be visible. You can then listen to updates of the visible virtual space via a callback you pass in to the `ViewPort` constructor.

#### API Reference

- [ViewPort](api/classes/viewport.md)
- [ViewPortCamera](api/classes/viewportcamera.md)

## Setting Bounds

By default the virtual space can be panned in any direction, or zoomed out, to infinity. You may want to set a boundary on that. To do that you get access to the `ViewPort` from the `Space` as described above, and call its `setBounds` method.

For example:

```javascript
function Example() {
  return (
    <div style={{ width: 300, height: 300, position: 'relative' }}>
      <Space onCreate={vp => vp.setBounds({ x: [0, 300], y: [0, 300] })}>...</Space>
    </div>
  );
}
```

Note the bounds are set in virtual space coordinates, and setting the bounds will cause the visible portion of the virtual space to be updated if needed.

## Preventing Accidental Browser Zooming

If you have your `Space` taking up all or almost all of the browser window, and you still render HTML elements outside of the `Space` (e.g. modals, or overlays, or panels to the left or right, etc) you may want to suppress browser zooming behavior on those other elements. If you don't do that, your users could spread/pinch on the elements outside the `Space` (e.g. a modal which is above your `Space`) and cause the browser to zoom in/out on the page... which is going to be kinda weird.

There are two things you should consider using to prevent browser zooming. First there is a utility function exported from the library called `suppressBrowserZooming` that will suppress browser zooming in almost all cases. It also returns a callback that will cancel the suppression, so it is easy to use as a `React` hook.

For example:

```javascript
function App() {
  React.useEffect(suppressBrowserZooming);
  return (...);
}
```

The only case it misses (as far as I am aware) is if you have certain HTML `<input>` elements within your `Space`. Mobile browsers like `Safari` may trigger browser zooming when the user focuses them. So, to suppress this zooming behavior, add this meta tag to your `<html>` `<head>` element:

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=0" />
    ...
  </head>
</html>
```

Just be aware that doing these two things means the user really won't be able to zoom in on anything outside the `Space`, and this may kill accessibility if you use small text or icons.

## Interactions and Pressable

Inside the `Space` clickable HTML elements like buttons and links will work OK, but when the user interacts with them the `Space` has to decide immediately to not initiate a pan. In this sense, these elements conflict with panning. This means, if you touch a button but then drag your finger off of it, it won't be treated as a pan. The reason for this is that if the `Space` did treat it as a pan, then when the interaction ended the browser would still think (since the pan kept the button under the finger) that the user wanted to click the button and it would fire a click event.

To let you create UI like buttons that don't conflict with panning, and to simplify dealing with interaction events, the library provides a few events and the `Pressable` component you can use.

The main interactions you will want to respond are what the library term "presses". These are single finger touches and left-click and drag mouse interactions, which are handled as pans by default. You can control how presses are handled by passing a callback to the `onDecideHowToHandlePress` prop on the `Space`, or using a `Pressable`.

The `Pressable` component in a way works like a button that will allow a press interaction to turn into a pan if the mouse or finger moves a certain distance. It also has functionality for distinguishing between normal and long taps, and even for capturing the press if you want to build other interactions like dragging.

`Pressable` doesn't have any built-in styling, so it will look like whatever children you pass it. It does have props to apply different styling or classes depending on how it is being interacted with.

Other than dealing with presses, there are events (in the form of props) on both the `Space` and the `Pressable` for dealing with mouse hovering, `onHover`, and right-clicks, `onContextMenu`. That is it though; there are no events that let you change the way zooming interactions work.

If you are using a `ViewPort` without a `Space`, it has its own lower-level set of interaction events you can use. You may also want to use the (also lower-level) `PressInterpreter` to make interpreting presses simpler (this is what the `Space` uses internally).

#### API Reference

- [Pressable](api/classes/pressable.md)
- [PressInterpreter](api/classes/pressinterpreter.md)

## NoPanArea

If you have a part of your `Space` that you do not want to be pan-able for some reason you can wrap it with `NoPanArea`. This has limited utility, but might be useful in some cases.

This doesn't affect zooming though.

#### API Reference

- [NoPanArea](api/classes/nopanarea.md)

## Known Issues

**Scrollable area inside the Space**

This doesn't work because panning takes precedence over scrolling.

## Complete API Reference

For more details on all the individual classes, functions, and types (this library is written in typescript after all), check out the [Complete API Reference](api/API.md).
