# Guide

This guide will walk you through what you need to know to use React Zoomable UI.

- [Installation](Guide.md#Installation)
- [The Space Component](Guide.md#TheSpaceComponent)
- [Virtual Space vs Client Space](Guide.md#VirtualSpacevsClientSpace)
- [Layout of Children](Guide.md#LayoutofChildren)
- [Sizing](Guide.md#Sizing)
- [Resizing](Guide.md#Resizing)
- [The ViewPort and ViewPortCamera](Guide.md#TheViewPortandViewPortCamera)
- [Setting Bounds](Guide.md#SettingBounds)
- [Preventing Accidental Browser Zooming](Guide.md#PreventingAccidentalBrowserZooming)
- [Preventing Browser Scroll Bouncing](Guide.md#PreventingBrowserScrollBouncing)
- [Interaction Events](Guide.md#GettingStarted)
- [Pressable](Guide.md#GettingStarted)
- [NoPanArea](Guide.md#GettingStarted)
- [Next Steps](Guide.md#GettingStarted)

## Installation

react-zoomable-ui requires React 16.3 or later.

Install it via:

```
npm install --save react-zoomable-ui
```

```
yarn add react-zoomable-ui
```

It includes TypeScript types.

## The Space Component

To make your HTML elements or other React components zoomable and pan-able, you simply put them inside a `Space` component.

E.g.

```javascript
import { Space } from 'react-zoomable-ui';

function Example() {
  return (
    <Space>
      <h1>Howdy</h1>
      <div>Try panning an zooming</div>
    </Space>
  );
}
```

How does it work? The `Space` component renders an outer `div` and an inner `div`, and the `Space`'s children get rendered inside the inner `div`. The `Space` listens for mouse and touch events on the outer `div` (and some other events), and based on those events translates (i.e. changes the x,y position) and scales the inner `div`, using CSS transforms. If there was no outer `div`, the inner `div` would just fly around the rest of the page, but the outer `div` is there and basically serves to give the inner `div` a limited area in which to be rendered (by the browser).

## VirtualSpace vs ClientSpace

You can think of the `Space`'s children as being rendered in a virtual space that is unconstrained by the dimensions of the window/document/page. This contrasts with the client space, which is the space display in the browser window (the top left corner of the document in the browser window is _always_ 0,0... irrespective of scrolling on the page).

The `Space`'s job could be seen conceptually as placing its children into virtual space, then translating the _visible_ portion of that into the client space of the browser window. That sounds a bit more complicated that maybe its needs to, but this is important.

Different functions will take coordinates or distances in either the virtual space or the client space, and while they are all very clear about what space they are operating on, you should still know what the difference is between the two spaces so you get the results you expect. Additionally, interaction events that the library generates contain coordinates in both virtual space and client space. So if you want to, say, position a modal OUTSIDE the `Space` near the location on the page where a user clicked you want to use the client space coordinates for the event, whereas if you want to position an element INSIDE the `Space` you want to use the virtual space coordinates.

## Layout of Children

For the children of the `Space`, by default they will be laid as if they were constrained by the width of the `Space`. For example, if the `Space` takes up the whole browser window, then the children will be laid out as if they had to fit inside the window's width.

This might be what you want, or it might not matter if you are rendering children with fixed sizes, but if you want the children to be laid out over a larger area you have a couple options:

- Pass a fixed `height` and `width` to the `Space`'s `contentDivStyle` prop, or wrap the children in a `div` with a fixed size.
- Position the children using absolute positioning.

## Sizing

Very important: the outer `div` rendered by the `Space` component is _absolutely positioned_ to take up all available space from its parent element. This can be overridden (with your own CSS rules or styles) but if you don't do that you probably should make sure its parent element has `position: relative` in its styles. One exception to that would be if you intend for the `Space` to cover the entire page, in which case it doesn't matter.

Also, note that by default the parent element will not get sized based on its `Space` child. This means that if the parent's size would be based on its children (e.g. its a simple `<div>` with no specific styling), it may end up with a height of 0. In which case the Space will also have a height of 0. You can give the parent element a fixed size or use Flexbox, `height: 100%`, or any other means to make the parent take up space on its own. For sizing to work well, `Space` probably should be the only child of its \* parent element.

If you want to make the `Space` take up all available window space, you can give all its parent elements (including the `html` and `body`) `height: 100%`.

If you want to make the `Space` take up a fixed amount of space, you can put it in a `div` with a fixed size (and `position: relative`).

If you want to make the `Space` take up almost all available space except for a top bar, bottom bar, and/or side panel, you can use flexbox to size the `div`s, and just make sure to add `position: relative` to the `div` that contains the `Space`.

# Resizing

If the element containing the `Space` resizes in some cases you may need to notify the `Space`. The `Space` will detect size changes when the window itself changes size, so if that is the only way for a resize to happen then you don't need to do anything extra.

If there are other cases where you can either manually tell the `Space` when the parent element is resizes via the `updateSize()` method, or set the `pollForElementResizing` prop to `true`. In the later case, the size will be checked every 500ms or so.

If the `Space` has a stale size nothing may immediately appear to be wrong, but certain behaviors like zooming may behave oddly.

## The ViewPort and ViewPortCamera

The `Space` creates and manages a `ViewPort` object that does the heavy lifting of responding to pans and zooms, and also determines what portion of the virtual space should be visible. You may need to interact with the `ViewPort` on occasion to see what the visible portion of the virtual space is (via its properties), or to do things like set the boundaries of the virtual space, translate coordinates from client to virtual space, or especially get access to the `ViewPortCamera`. The `ViewPortCamera` has methods that let you change the visible portion of the virtual space, with or without animations.

You can get access to the `ViewPort` from the `Space` in a few ways:

- The `viewPort` property on the `Space` instance.
- The `onCreate` and `onUpdate` props on the `Space`.
- Using the `SpaceContext` in any component rendered inside the `Space`.

Also, note that the `ViewPort` can by itself without the `Space` and without `React`, if you want to do something more custom with your rendering (e.g. canvas or WebGL). You just construct a new `ViewPort` with a `div` that is the space in which rendering should happen, and it will listen for interaction events on it. You listen for changes to the visible virtual space, as well as user interactions (like presses), via callbacks you can pass in to the constructor. You may also want to use the low level `PressInterpreter` to make dealing with interpreting presses simpler (the `Space` uses this internally).

## Setting Bounds

By default the virtual space can be panned in any direction, or zoomed out, to infinity. You may want to set a boundary on that. To do that you get access to the `ViewPort` from the `Space`, as described above, can call its `setBounds` method.

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

Note the bounds are set in terms of the virtual space, not the client space.

## Preventing Accidental Browser Zooming

If you have your `Space` taking up all or the main portion of the browser window, but you still render HTML elements outside of the `Space` (e.g. modals, or overlays, or panels to the left or right, etc) you may want to suppress browser zooming behavior. If you don't do that, your users could spread/pinch on the elements outside the `Space` (e.g. a modal which is above your `Space`) and cause the browser to zoom in/out on the page... which is going to be kinda weird.

There are two things you should consider using to prevent browser zooming. First there is a utility function exported from the library called `suppressBrowserZooming` that you can call to suppress browser zooming events outside the `Space`. It also returns a callback that will cancel the suppression, so it is easy to use as a `React` hook.

For example:

```javascript
function App() {
  React.useEffect(suppressBrowserZooming);
  return (...);
}
```

Second, if you have certain HTML `<input>` elements within your `Space`, mobile browsers like `Safari` may trigger browser zooming when the user focuses them. To suppress this zooming behavior, add this meta tag to your `<html>` `<head>` element:

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=0" />
    ...
  </head>
</html>
```

Just be aware that doing these two things means the user really won't be able to zoom in on anything outside the `Space`, and this may kill accessibility if you use small text or icons.

## Preventing Browser Scroll Bouncing

You may also want to suppress the browser scroll bouncing behavior on elements outside your `Space`. This is the bouncing behavior the user will see if they try to scroll a part of your page outside the `Space` even though contents of the page fill the entire window, or if the user scrolls an actual scrollable area within the page, but outside the `Space` (e.g. in a modal), and reaches the end. This is just a weird visual annoyance but you can fix it with some CSS:

```
html, body {
  overflow: hidden;
}
```

## Pressable

Inside the `Space`, HTML elements like buttons and links will work. But, when the user starts a touch or clicks the mouse (but doesn't release) on those elements, the `Space` has to decide immediately that the interaction can't be a pan. Ideally if the user moved the mouse or their finger enough we'd like the interaction to become a pan, but if the `Space` allowed that then when the interaction ends the browser will think the button or link was clicked, and respond accordingly.

So, the library provides a `Pressable` component that can correctly distinguish pan gestures from taps/clicks in a natural way. It also has some functionality to recognize long taps and some other functionality you can build on to implement things like dragging.

## NoPanArea

If you have a part of your `Space` that you do not want to be pan-able for some reason you can wrap it with `NoPanArea`. This has limited utility, but might be useful in some cases.

This doesn't affect zooming though.

## Interaction Events

For single finger touches, and for left-button mouse events...

The `Space` takes a few props that let you deal with mouse and touch events in a unified way. There is `onHover` for mouse hover, and `onPressContextMenu` for right clicks. But the most interesting prop is `onDecideHowToHandlePress`.

This is a callback that is called when the user does something that could be a pan, or could be something else. This means its a single finger touch gesture start event, or a left-button mouse down event. Your callback can tell the `Space` to ignore the interaction entirely (no panning), treat it as a pan, capture the press (with some additional callbacks you return), or wait and see if it is a tap or long tap (again, with some more callbacks you return).

All these events get coordinates in both virtual space and client space.

If you are using the `ViewPort` without the `Space` the `PressInterpreter` can provide the `onDecideHowToHandlePress` functionality described. You instantiate `PressInterpreter` with a callback just like the one you'd pass to the `onDecideHowToHandlePress` prop, and then when you create the `ViewPort` connect it to the `PressInterpreter` like this:

```javascript
const pressInterpreter = new PressInterpreter(callback);
const viewPort = new ViewPort(divElement, {
  ...pressInterpreter.pressHandlers,
  // other ViewPortOptions
});
```

Finally, if you are using `ViewPort` without the `Space` you don't have to use the `PressInterpreter`. The `ViewPort` has unified "press" events you can use to implement whatever behavior you want.

## Next Steps

- Checkout [Known Issues](KnownIssues.md)
- [API Reference](API.md)
