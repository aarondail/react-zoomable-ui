# Known Issues

## Scrollable area inside the zoomable area:

If you have HTML elements inside a `Space`, don't try to make them scrollable (via `overflow: scroll`). This works ok on some browsers, like Safari but kills panning and zooming performance on others, like `Chrome`.
