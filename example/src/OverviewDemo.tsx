import * as lodash from 'lodash';
import * as React from 'react';
import { Pressable, Space, NoPanArea, SpaceContext } from 'react-zoomable-ui';

import mountain from './mountain.jpg';

const SimpleTapCountingButton = React.memo(() => {
  const [tapCount, setTapCount] = React.useState(0);
  const [message, setMessage] = React.useState('TAP ME');
  return (
    <Pressable
      style={{
        fontSize: 'small',
        color: 'white',
        backgroundColor: 'darkorchid',
        borderRadius: 10,
        padding: 20,
      }}
      potentialTapStyle={{ backgroundColor: 'blue' }}
      potentialLongTapStyle={{ backgroundColor: 'darkblue' }}
      hoverStyle={{ backgroundColor: 'orchid' }}
      onTap={() => {
        setTapCount(tapCount + 1);
        setMessage('TAP COUNT: ' + (tapCount + 1));
      }}
      onLongTap={() => {
        setMessage('LONG TAPPED!');
      }}
    >
      {message}
    </Pressable>
  );
});

const DragContainer = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <div
      style={{
        height: 200,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        border: 'dotted 2px #999',
      }}
    >
      {children}
    </div>
  );
};

interface DraggableButtonProps {
  readonly capturePressOn: 'press' | 'long-press';
}

const DraggableButton = (props: DraggableButtonProps) => {
  const [{ x, y }, setTranslation] = React.useState({ x: 0, y: 0 });
  const [{ panOffsetX, panOffsetY }, setPanOffset] = React.useState({
    panOffsetX: 0,
    panOffsetY: 0,
  });
  const context = React.useContext(SpaceContext);

  const baseStyle: React.CSSProperties = {
    fontSize: 'small',
    color: 'white',
    background:
      props.capturePressOn === 'press'
        ? 'repeating-linear-gradient(darkgreen, darkgreen 2px, green 3px, green 4px)'
        : 'repeating-linear-gradient(darkgoldenrod, darkgoldenrod 2px, goldenrod 3px, goldenrod 4px)',
    borderRadius: 10,
    padding: 20,
    textAlign: 'center',
    width: 120,
  };

  return (
    <Pressable
      style={Object.assign({}, baseStyle, { transform: `translate(${x}px, ${y}px)` })}
      capturePressThresholdMs={props.capturePressOn === 'press' ? 0 : 500}
      potentialTapStyle={props.capturePressOn === 'long-press' ? { background: 'orange' } : undefined}
      capturePressStyle={props.capturePressOn === 'press' ? { background: 'green' } : { background: 'darkorange' }}
      onCapturePressStart={(coords, pressableUnderlyingElement) => {
        const vp = context.viewPort;
        const pressableVirtualSpaceRect = vp.translateClientRectToVirtualSpace(pressableUnderlyingElement);
        // The offset is useful because it records which part of the Pressable
        // the pan started on. If we don't have this, when we calculate the new
        // x and y coordinates for the Pressable when the pan moves we would by
        // default treat it like the top left of the Pressable was always the
        // part being dragged.
        setPanOffset({
          panOffsetX: coords.x - pressableVirtualSpaceRect.left,
          panOffsetY: coords.y - pressableVirtualSpaceRect.top,
        });
      }}
      onCapturePressMove={(coords, pressableUnderlyingElement) => {
        // Note that almost all the complexity here is due to trying to bound
        // the pressable inside its parent. If we didn't care about that we
        // could just use the deltas in `coords` and add those to the current x
        // and y values.  We also wouldn't need `onCapturePanStart`.
        const vp = context.viewPort;
        const dragContainerBounds = vp.translateClientRectToVirtualSpace(pressableUnderlyingElement.parentElement!);
        const { width: childWidth, height: childHeight } =
          vp.translateClientRectToVirtualSpace(pressableUnderlyingElement);

        const logicalX = lodash.clamp(
          coords.x - panOffsetX,
          dragContainerBounds.left,
          dragContainerBounds.right - childWidth,
        );
        const logicalY = lodash.clamp(
          coords.y - panOffsetY,
          dragContainerBounds.top,
          dragContainerBounds.bottom - childHeight,
        );

        // Finally since we start with the button centered inside the drag
        // container, and thus x = 0 and y = 0 means the CENTER of the drag
        // container, rather than the top left, we have to subtract the center
        // of the drag container from our new x and y so that the final
        // translated position (which will be offset from the CENTER) is right.
        const finalX = logicalX - dragContainerBounds.left - dragContainerBounds.width / 2 + childWidth / 2;
        const finalY = logicalY - dragContainerBounds.top - dragContainerBounds.height / 2 + childHeight / 2;

        setTranslation({ x: finalX, y: finalY });
      }}
    >
      {props.capturePressOn === 'press'
        ? 'DRAG ME'
        : ({ interaction }) =>
            interaction === undefined
              ? 'CLICK/TOUCH ME'
              : interaction === 'potential-tap'
              ? 'WAIT A BIT'
              : interaction === 'press-captured'
              ? 'DRAG'
              : '?'}
    </Pressable>
  );
};

export const OverviewDemo = () => {
  const spaceRef = React.useRef<Space | null>(null);
  return (
    <Space
      ref={spaceRef}
      onCreate={(vp) => vp.camera.centerFitHorizontalAreaIntoView(0, 1000)}
      innerDivStyle={innerDivStyle}
    >
      <div style={innerContainerStyle}>
        <h3>(1) Click or touch anywhere and drag to pan</h3>
        <h3>(2) Use two fingers to zoom in and out, or the mouse wheel</h3>
        <h3>(3) Regular HTML elements behave mostly as expected</h3>
        <div style={rowStyle}>
          <div style={columnStyle}>
            <img id="mountain-image" src={mountain} width={100} height={100} alt="logo" />
            <a href="https://reactjs.org/">https://reactjs.org/</a>
            <br />
            <button onClick={() => alert('CLICKED')}>CLICK ME FOR AN ALERT</button>
            <pre>SOME CODE in a PRE TAG</pre>
            <button
              onClick={() => {
                const element = document.getElementById('mountain-image');
                if (element) {
                  spaceRef.current?.viewPort?.camera.centerFitElementIntoView(
                    element,
                    {
                      // Zoom in to the element but stop at 100 pixels (as in,
                      // client pixels, ala what the browser thinks is a pixel in
                      // most cases) around it
                      elementExtraMarginForZoomInClientSpace: 100,
                    },
                    {
                      durationMilliseconds: 1000,
                    },
                  );
                }
              }}
            >
              Click to zoom into the mountain
            </button>
          </div>

          <div style={columnStyle}>
            <select>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
            <br />
            <input type="date" />
            <br />
            <input type="text" />
            <br />
            <textarea></textarea>
          </div>
        </div>
        <h3>(4) Specialized Components for more complex interactions</h3>
        <div style={rowStyle}>
          <div style={columnStyle}>
            <div>
              <b>Pressable</b>
              <br />
              Creates a clickable and tap-able space that doesn't conflict with panning. It also can handle long clicks
              or taps.
              <br />
              <br />
              Try clicking or tapping on the button below and releasing. Then try doing it again, but dragging before
              releasing to start a pan.
            </div>
            <br />
            <SimpleTapCountingButton />
          </div>

          <div style={columnStyle}>
            <div>
              <b>Pressable (continued)</b>
              <br />
              Has functionality that can be used to build custom interactions, like dragging.
            </div>
            <br />
            <DragContainer>
              <DraggableButton capturePressOn="press" />
            </DragContainer>
            <br />
            <DragContainer>
              <DraggableButton capturePressOn="long-press" />
            </DragContainer>
          </div>

          <div style={columnStyle}>
            <div>
              <b>NoPanArea</b>
              <br />
              Creates an area where pan interactions are ignored (not zoom though).
            </div>
            <br />
            <NoPanArea style={noPanAreaStyle}>
              <span>Can't pan from within this area</span>
            </NoPanArea>
          </div>
        </div>
      </div>
    </Space>
  );
};

const innerDivStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  flexDirection: 'row',
  width: 1000,
};

const innerContainerStyle: React.CSSProperties = {
  backgroundColor: 'white',
  maxWidth: 830,
  minWidth: '60%',
  minHeight: 200,
  border: 'solid 1px #bbb',
  padding: 5,
  marginBottom: 40,
};

const rowStyle: React.CSSProperties = { flex: 1, display: 'flex ' };

const columnStyle: React.CSSProperties = {
  flex: 1,
  margin: 10,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  fontSize: 'small',
};

const noPanAreaStyle: React.CSSProperties = {
  backgroundColor: 'darkred',
  color: 'white',
  height: 100,
  width: 100,
};
