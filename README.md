## ZOOMABLE UI

Components:

- Pan zoom area
- With inner elements that can respond in a nuanced way to presss and long-presses
- The elements can trigger a press, drag on the area, or long-press and become draggable.
- Draggable and droppable objects

## Notes that need to be added to somewhere later to understand

## Cavets

1. Scrollable area inside the zoomable area:

- For components in a <Space> don't use overflow: scroll/auto inside the Zoomable Space... at least for Chrome (Safari seems ok)
- Basically you can't make scrollable via overflow :( otherwise it is too janky

## Browser Support

1. Edge, only mouse works 100%. Touch does for single finger gestures, not
   pinch/spread. Will revisit when edge moves to Chromium. Unsure about
   touchpad, but its probably fine though pinch/zoom may not work.

Unsure about IE. Probably fine for mouse and fails horribly for touch.

Unsure about stylus.
