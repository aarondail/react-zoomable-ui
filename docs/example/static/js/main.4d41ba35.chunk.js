(this['webpackJsonpreact-zoomable-ui-example'] = this['webpackJsonpreact-zoomable-ui-example'] || []).push([
  [0],
  {
    17: function(e, t, n) {
      e.exports = n.p + 'static/media/mountain.5abca7a2.jpg';
    },
    38: function(e, t, n) {
      e.exports = n(69);
    },
    60: function(e, t, n) {},
    69: function(e, t, n) {
      'use strict';
      n.r(t);
      var l = n(0),
        a = n.n(l),
        r = n(34),
        i = n.n(r),
        o = n(7),
        c = n(8),
        u = n(1),
        s =
          (n(60),
          function(e) {
            e.setBounds({ x: [0, 400], y: [0, 200] });
          }),
        m = function() {
          return l.createElement(
            u.Space,
            { onCreate: s },
            l.createElement(
              'div',
              { style: d },
              l.createElement(
                'span',
                null,
                'This box is 200px by 200px wide, but the view port bounds are x: 0 to 400, and y 0 to 200. That means the view port has to zoom in to fix the box within the bounds, and you can pan a bit left to right but not up to down, unless you zoom in some more.',
              ),
            ),
          );
        },
        d = {
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
        },
        v = function() {
          var e = l.useRef(null);
          return l.createElement(
            l.Fragment,
            null,
            l.createElement(
              u.Space,
              {
                ref: e,
                style: { backgroundColor: 'black' },
                onCreate: function(e) {
                  return e.camera.recenter(100, 100, 2);
                },
              },
              l.createElement('div', { style: { width: 200, height: 200, left: 0, top: 0, backgroundColor: 'blue' } }),
            ),
            l.createElement(
              'div',
              { style: { position: 'absolute', left: '50%', bottom: 20 } },
              l.createElement(
                'div',
                {
                  style: {
                    position: 'relative',
                    left: '-50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#6666',
                    padding: 20,
                    borderRadius: 14,
                  },
                },
                l.createElement('div', { style: { color: 'white', marginBottom: 5 } }, 'Camera Control'),
                l.createElement(
                  'div',
                  { style: { display: 'flex', flexDirection: 'row' } },
                  l.createElement(
                    'button',
                    {
                      style: p,
                      onClick: function() {
                        var t, n;
                        return null === (t = e.current) || void 0 === t
                          ? void 0
                          : null === (n = t.viewPort) || void 0 === n
                          ? void 0
                          : n.camera.moveBy(0, 0, 0.1);
                      },
                    },
                    '+',
                  ),
                  l.createElement(
                    'button',
                    {
                      style: p,
                      onClick: function() {
                        var t, n;
                        return null === (t = e.current) || void 0 === t
                          ? void 0
                          : null === (n = t.viewPort) || void 0 === n
                          ? void 0
                          : n.camera.moveBy(0, 0, -0.1);
                      },
                    },
                    '\u2212',
                  ),
                ),
                l.createElement(
                  'div',
                  null,
                  l.createElement(
                    'button',
                    {
                      style: p,
                      onClick: function() {
                        var t, n;
                        return null === (t = e.current) || void 0 === t
                          ? void 0
                          : null === (n = t.viewPort) || void 0 === n
                          ? void 0
                          : n.camera.moveBy(0, -20, 0, void 0, void 0, { durationMilliseconds: 500 });
                      },
                    },
                    '\u21e7',
                  ),
                ),
                l.createElement(
                  'div',
                  null,
                  l.createElement(
                    'button',
                    {
                      style: p,
                      onClick: function() {
                        var t, n;
                        return null === (t = e.current) || void 0 === t
                          ? void 0
                          : null === (n = t.viewPort) || void 0 === n
                          ? void 0
                          : n.camera.moveBy(0, -5);
                      },
                    },
                    '\u2191',
                  ),
                ),
                l.createElement(
                  'div',
                  { style: { display: 'flex', flexDirection: 'row' } },
                  l.createElement(
                    'button',
                    {
                      style: p,
                      onClick: function() {
                        var t, n;
                        return null === (t = e.current) || void 0 === t
                          ? void 0
                          : null === (n = t.viewPort) || void 0 === n
                          ? void 0
                          : n.camera.moveBy(-20, 0, 0, void 0, void 0, { durationMilliseconds: 500 });
                      },
                    },
                    '\u21e6',
                  ),
                  l.createElement(
                    'button',
                    {
                      style: p,
                      onClick: function() {
                        var t, n;
                        return null === (t = e.current) || void 0 === t
                          ? void 0
                          : null === (n = t.viewPort) || void 0 === n
                          ? void 0
                          : n.camera.moveBy(-5, 0);
                      },
                    },
                    '\u2190',
                  ),
                  l.createElement('div', { style: p }),
                  l.createElement(
                    'button',
                    {
                      style: p,
                      onClick: function() {
                        var t, n;
                        return null === (t = e.current) || void 0 === t
                          ? void 0
                          : null === (n = t.viewPort) || void 0 === n
                          ? void 0
                          : n.camera.moveBy(5, 0);
                      },
                    },
                    '\u2192',
                  ),
                  l.createElement(
                    'button',
                    {
                      style: p,
                      onClick: function() {
                        var t, n;
                        return null === (t = e.current) || void 0 === t
                          ? void 0
                          : null === (n = t.viewPort) || void 0 === n
                          ? void 0
                          : n.camera.moveBy(20, 0, 0, void 0, void 0, { durationMilliseconds: 500 });
                      },
                    },
                    '\u21e8',
                  ),
                ),
                l.createElement(
                  'div',
                  null,
                  l.createElement(
                    'button',
                    {
                      style: p,
                      onClick: function() {
                        var t, n;
                        return null === (t = e.current) || void 0 === t
                          ? void 0
                          : null === (n = t.viewPort) || void 0 === n
                          ? void 0
                          : n.camera.moveBy(0, 5);
                      },
                    },
                    '\u2193',
                  ),
                ),
                l.createElement(
                  'div',
                  null,
                  l.createElement(
                    'button',
                    {
                      style: p,
                      onClick: function() {
                        var t, n;
                        return null === (t = e.current) || void 0 === t
                          ? void 0
                          : null === (n = t.viewPort) || void 0 === n
                          ? void 0
                          : n.camera.moveBy(0, 20, 0, void 0, void 0, { durationMilliseconds: 500 });
                      },
                    },
                    '\u21e9',
                  ),
                ),
              ),
            ),
          );
        },
        p = { width: 30, height: 30, fontSize: 16 },
        E = n(13),
        g = function(e) {
          switch (e % 4) {
            case 0:
              return '#440023';
            case 1:
              return '#F0A932';
            case 2:
              return '#39AA99';
            case 3:
              return '#839FFF';
          }
        },
        b = function() {
          return l.createElement(
            u.Space,
            { style: { backgroundColor: 'black' }, innerDivStyle: { width: 1e4 } },
            E.range(0, 30).map(function(e) {
              return l.createElement(
                'div',
                { key: 'row-'.concat(e), style: { display: 'flex', flexDirection: 'row' } },
                E.range(0, 40).map(function(t) {
                  return l.createElement(
                    'div',
                    {
                      key: 'column-'.concat(t),
                      style: { height: 200, width: 200, backgroundColor: g(t + e), margin: 10, color: 'white' },
                    },
                    e,
                    ',',
                    t,
                  );
                }),
              );
            }),
          );
        },
        f =
          '\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis fermentum ex. Vestibulum interdum nulla quis venenatis mattis. Praesent elementum a sem vel molestie. Pellentesque eu neque eget eros sagittis sodales vel non ligula. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec lacus nec nulla congue posuere. Fusce turpis lorem, laoreet nec elit ut, lacinia efficitur velit.\n\nDonec quis semper tellus, ac vulputate leo. Vivamus aliquet ipsum sed sollicitudin fermentum. Sed vehicula, quam vel viverra gravida, risus urna cursus mi, sed porttitor arcu dolor interdum elit. Nulla ipsum metus, sollicitudin a mi non, bibendum tristique mi. Integer posuere ipsum quis felis vulputate, eget placerat eros lacinia. Sed quis sollicitudin tortor, at hendrerit risus. Nullam et est placerat, molestie urna aliquet, dictum lorem. Donec tellus purus, accumsan vel eros vulputate, finibus feugiat mi. Phasellus erat massa, porta non finibus ut, pellentesque id sapien. Cras interdum volutpat lacus id iaculis. Sed iaculis velit eu nisi vestibulum dignissim. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam sit amet mauris dictum, tristique lectus eget, scelerisque augue. Duis luctus ac libero vel iaculis.\n\nQuisque vitae nulla tempus, mollis elit nec, dapibus quam. Curabitur eget augue a metus aliquet suscipit in ac sapien. Vestibulum ac lectus ut arcu fringilla iaculis id nec mauris. Fusce quis lacus id sapien rhoncus molestie. Duis lacinia et magna eu molestie. In est dui, posuere et accumsan ut, faucibus sed velit. Donec id tellus sed lorem ornare efficitur. Integer sit amet odio tortor. Vestibulum tristique ex nec facilisis tristique.\n',
        h = function() {
          return l.createElement(
            u.Space,
            { style: { backgroundColor: 'azure' }, innerDivStyle: { padding: 20, backgroundColor: '#fafee9' } },
            l.createElement('h6', null, '1.'),
            l.createElement('div', null, f),
            l.createElement('h6', null, '2.'),
            l.createElement('div', null, f),
            l.createElement('h6', null, '3.'),
            l.createElement('div', null, f),
            l.createElement('h6', null, '4.'),
            l.createElement('div', null, f),
            l.createElement('h6', null, '5.'),
            l.createElement('div', null, f),
            l.createElement('h6', null, '6.'),
            l.createElement('div', null, f),
            l.createElement('h6', null, '7.'),
            l.createElement('div', null, f),
            l.createElement('h6', null, '8.'),
            l.createElement('div', null, f),
            l.createElement('h6', null, '9.'),
            l.createElement('div', null, f),
            l.createElement('h6', null, '10.'),
            l.createElement('div', null, f),
          );
        },
        y = n(6),
        C = function(e) {
          e.camera.recenter(100, 100, 2);
        },
        x = function(e) {
          return void 0 === e
            ? '-'
            : 'virtual: '
                .concat(e.x.toFixed(1), ', ')
                .concat(e.y.toFixed(1), ', client: ')
                .concat(e.clientX.toFixed(1), ', ')
                .concat(e.clientY.toFixed(1));
        },
        w = function() {
          var e = l.useRef(null),
            t = l.useState(),
            n = Object(y.a)(t, 2),
            a = n[0],
            r = n[1],
            i = l.useState(),
            o = Object(y.a)(i, 2),
            c = o[0],
            s = o[1],
            m = l.useState(),
            d = Object(y.a)(m, 2),
            v = d[0],
            p = d[1],
            E = l.useState(),
            g = Object(y.a)(E, 2),
            b = g[0],
            f = g[1];
          return l.createElement(
            u.Space,
            {
              ref: e,
              style: { backgroundColor: 'black' },
              onCreate: C,
              onDecideHowToHandlePress: function(e, t) {
                var n;
                r(t);
                for (var l = e.target; !n && e; ) (n = l.id) || (l = l.parentElement);
                return 'prevent_drag' === n
                  ? { ignorePressEntirely: !0 }
                  : 'capture_press' === n
                  ? {
                      capturePressThresholdMs: 0,
                      onCapturePressMove: function(e) {
                        return f(e);
                      },
                    }
                  : void 0;
              },
              onHover: function(e, t) {
                return s(t);
              },
              onPressContextMenu: function(e, t) {
                return p(t);
              },
            },
            l.createElement(
              'div',
              { style: { width: 200, height: 200, left: 0, top: 0, backgroundColor: '#FFF', fontSize: 10 } },
              l.createElement('div', null, 'Press:', l.createElement('br', null), l.createElement('small', null, x(a))),
              l.createElement('br', null),
              l.createElement(
                'div',
                null,
                'Hover:',
                l.createElement('br', null),
                ' ',
                l.createElement('small', null, x(c)),
              ),
              l.createElement('br', null),
              l.createElement(
                'div',
                null,
                'Press Context Menu:',
                l.createElement('br', null),
                ' ',
                l.createElement('small', null, x(v)),
              ),
              l.createElement('br', null),
              l.createElement(
                'div',
                null,
                'Capture Press:',
                l.createElement('br', null),
                ' ',
                l.createElement('small', null, x(b)),
              ),
              l.createElement('br', null),
              l.createElement(
                'div',
                { style: { display: 'flex', justifyContent: 'center' } },
                l.createElement(
                  'div',
                  {
                    id: 'capture_press',
                    style: {
                      width: 100,
                      backgroundColor: 'red',
                      padding: 4,
                      paddingBottom: 6,
                      borderRadius: 2,
                      margin: 10,
                    },
                  },
                  l.createElement('small', null, 'CAPTURE PRESS TEST'),
                ),
                l.createElement('br', null),
                l.createElement(
                  'div',
                  {
                    id: 'prevent_drag',
                    style: {
                      width: 100,
                      backgroundColor: 'orange',
                      padding: 4,
                      paddingBottom: 6,
                      borderRadius: 2,
                      margin: 10,
                    },
                  },
                  l.createElement('small', null, 'PREVENT DRAG TEST'),
                ),
              ),
            ),
          );
        },
        k = n(17),
        P = n.n(k),
        S = l.memo(function() {
          var e = l.useState(0),
            t = Object(y.a)(e, 2),
            n = t[0],
            a = t[1],
            r = l.useState('TAP ME'),
            i = Object(y.a)(r, 2),
            o = i[0],
            c = i[1];
          return l.createElement(
            u.Pressable,
            {
              style: {
                fontSize: 'small',
                color: 'white',
                backgroundColor: 'darkorchid',
                borderRadius: 10,
                padding: 20,
              },
              potentialTapStyle: { backgroundColor: 'blue' },
              potentialLongTapStyle: { backgroundColor: 'darkblue' },
              hoverStyle: { backgroundColor: 'orchid' },
              onTap: function() {
                a(n + 1), c('TAP COUNT: ' + (n + 1));
              },
              onLongTap: function() {
                c('LONG TAPPED!');
              },
            },
            o,
          );
        }),
        T = function(e) {
          var t = e.children;
          return l.createElement(
            'div',
            {
              style: {
                height: 200,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#eee',
                border: 'dotted 2px #999',
              },
            },
            t,
          );
        },
        O = function(e) {
          var t = l.useState({ x: 0, y: 0 }),
            n = Object(y.a)(t, 2),
            a = n[0],
            r = a.x,
            i = a.y,
            o = n[1],
            c = l.useState({ panOffsetX: 0, panOffsetY: 0 }),
            s = Object(y.a)(c, 2),
            m = s[0],
            d = m.panOffsetX,
            v = m.panOffsetY,
            p = s[1],
            g = l.useContext(u.SpaceContext),
            b = {
              fontSize: 'small',
              color: 'white',
              background:
                'press' === e.capturePressOn
                  ? 'repeating-linear-gradient(darkgreen, darkgreen 2px, green 3px, green 4px)'
                  : 'repeating-linear-gradient(darkgoldenrod, darkgoldenrod 2px, goldenrod 3px, goldenrod 4px)',
              borderRadius: 10,
              padding: 20,
              textAlign: 'center',
              width: 120,
            };
          return l.createElement(
            u.Pressable,
            {
              style: Object.assign({}, b, { transform: 'translate('.concat(r, 'px, ').concat(i, 'px)') }),
              capturePressThresholdMs: 'press' === e.capturePressOn ? 0 : 500,
              potentialTapStyle: 'long-press' === e.capturePressOn ? { background: 'orange' } : void 0,
              capturePressStyle: 'press' === e.capturePressOn ? { background: 'green' } : { background: 'darkorange' },
              onCapturePressStart: function(e, t) {
                var n = g.viewPort.translateClientRectToVirtualSpace(t);
                p({ panOffsetX: e.x - n.left, panOffsetY: e.y - n.top });
              },
              onCapturePressMove: function(e, t) {
                var n = g.viewPort,
                  l = n.translateClientRectToVirtualSpace(t.parentElement),
                  a = n.translateClientRectToVirtualSpace(t),
                  r = a.width,
                  i = a.height,
                  c = E.clamp(e.x - d, l.left, l.right - r),
                  u = E.clamp(e.y - v, l.top, l.bottom - i),
                  s = c - l.left - l.width / 2 + r / 2,
                  m = u - l.top - l.height / 2 + i / 2;
                o({ x: s, y: m });
              },
            },
            'press' === e.capturePressOn
              ? 'DRAG ME'
              : function(e) {
                  var t = e.interaction;
                  return void 0 === t
                    ? 'CLICK/TOUCH ME'
                    : 'potential-tap' === t
                    ? 'WAIT A BIT'
                    : 'press-captured' === t
                    ? 'DRAG'
                    : '?';
                },
          );
        },
        A = function() {
          return l.createElement(
            u.Space,
            {
              onCreate: function(e) {
                return e.camera.centerFitHorizontalAreaIntoView(0, 1e3);
              },
              innerDivStyle: D,
            },
            l.createElement(
              'div',
              { style: q },
              l.createElement('h3', null, '(1) Click or touch anywhere and drag to pan'),
              l.createElement('h3', null, '(2) Use two fingers to zoom in and out, or the mouse wheel'),
              l.createElement('h3', null, '(3) Regular HTML elements behave mostly as expected'),
              l.createElement(
                'div',
                { style: B },
                l.createElement(
                  'div',
                  { style: I },
                  l.createElement('img', { src: P.a, width: 100, height: 100, alt: 'logo' }),
                  l.createElement('a', { href: 'https://reactjs.org/' }, 'https://reactjs.org/'),
                  l.createElement('br', null),
                  l.createElement(
                    'button',
                    {
                      onClick: function() {
                        return alert('CLICKED');
                      },
                    },
                    'CLICK ME FOR AN ALERT',
                  ),
                  l.createElement('pre', null, 'SOME CODE in a PRE TAG'),
                ),
                l.createElement(
                  'div',
                  { style: I },
                  l.createElement(
                    'select',
                    null,
                    l.createElement('option', null, 'A'),
                    l.createElement('option', null, 'B'),
                    l.createElement('option', null, 'C'),
                    l.createElement('option', null, 'D'),
                  ),
                  l.createElement('br', null),
                  l.createElement('input', { type: 'date' }),
                  l.createElement('br', null),
                  l.createElement('input', { type: 'text' }),
                  l.createElement('br', null),
                  l.createElement('textarea', null),
                ),
              ),
              l.createElement('h3', null, '(4) Specialized Components for more complex interactions'),
              l.createElement(
                'div',
                { style: B },
                l.createElement(
                  'div',
                  { style: I },
                  l.createElement(
                    'div',
                    null,
                    l.createElement('b', null, 'Pressable'),
                    l.createElement('br', null),
                    "Creates a clickable and tap-able space that doesn't conflict with panning. It also can handle long clicks or taps.",
                    l.createElement('br', null),
                    l.createElement('br', null),
                    'Try clicking or tapping on the button below and releasing. Then try doing it again, but dragging before releasing to start a pan.',
                  ),
                  l.createElement('br', null),
                  l.createElement(S, null),
                ),
                l.createElement(
                  'div',
                  { style: I },
                  l.createElement(
                    'div',
                    null,
                    l.createElement('b', null, 'Pressable (continued)'),
                    l.createElement('br', null),
                    'Has functionality that can be used to build custom interactions, like dragging.',
                  ),
                  l.createElement('br', null),
                  l.createElement(T, null, l.createElement(O, { capturePressOn: 'press' })),
                  l.createElement('br', null),
                  l.createElement(T, null, l.createElement(O, { capturePressOn: 'long-press' })),
                ),
                l.createElement(
                  'div',
                  { style: I },
                  l.createElement(
                    'div',
                    null,
                    l.createElement('b', null, 'NoPanArea'),
                    l.createElement('br', null),
                    'Creates an area where pan interactions are ignored (not zoom though).',
                  ),
                  l.createElement('br', null),
                  l.createElement(
                    u.NoPanArea,
                    { style: R },
                    l.createElement('span', null, "Can't pan from within this area"),
                  ),
                ),
              ),
            ),
          );
        },
        D = {
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 40,
          width: 1e3,
        },
        q = {
          backgroundColor: 'white',
          maxWidth: 830,
          minWidth: '60%',
          minHeight: 200,
          border: 'solid 1px #bbb',
          padding: 5,
          marginBottom: 40,
        },
        B = { flex: 1, display: 'flex ' },
        I = { flex: 1, margin: 10, display: 'flex', alignItems: 'center', flexDirection: 'column', fontSize: 'small' },
        R = { backgroundColor: 'darkred', color: 'white', height: 100, width: 100 },
        z = function() {
          var e = function() {
            return l.createElement(
              'div',
              { style: { width: 300, height: 300, position: 'relative' } },
              l.createElement(
                u.Space,
                {
                  style: { border: 'solid 1px black', margin: 20 },
                  onCreate: function(e) {
                    e.setBounds({ x: [0, 1280], y: [0, 960] }),
                      e.camera.centerFitAreaIntoView({ left: 0, top: 0, width: 1280, height: 960 });
                  },
                },
                l.createElement('img', { src: P.a, width: 1280, height: 960, alt: 'A Mountain' }),
              ),
            );
          };
          return l.createElement(
            'div',
            null,
            l.createElement(
              'div',
              { style: { display: 'flex', paddingTop: 80, justifyContent: 'center' } },
              e(),
              e(),
              e(),
            ),
          );
        };
      i.a.render(
        a.a.createElement(function() {
          return (
            a.a.useEffect(u.suppressBrowserZooming),
            a.a.createElement(
              'div',
              { style: { height: '100%', display: 'flex', flexDirection: 'column' } },
              a.a.createElement(
                o.a,
                null,
                a.a.createElement(
                  'nav',
                  { style: { backgroundColor: '#0bf9', padding: '5px 10px' } },
                  a.a.createElement(o.b, { to: '/overview', activeClassName: 'active' }, 'Overview'),
                  ' ',
                  a.a.createElement(o.b, { to: '/zoomableImages', activeClassName: 'active' }, 'Zoomable Images'),
                  ' ',
                  a.a.createElement(o.b, { to: '/largeArea', activeClassName: 'active' }, 'Large Area'),
                  ' ',
                  a.a.createElement(o.b, { to: '/longPage', activeClassName: 'active' }, 'Long Page'),
                  ' ',
                  a.a.createElement(o.b, { to: '/cameraControl', activeClassName: 'active' }, 'Camera Control'),
                  ' ',
                  a.a.createElement(o.b, { to: '/bounds', activeClassName: 'active' }, 'Bounds'),
                  ' ',
                  a.a.createElement(o.b, { to: '/lowLevelEvents', activeClassName: 'active' }, 'Low Level Events'),
                  ' ',
                ),
                a.a.createElement(
                  'div',
                  { style: { flexGrow: 1, position: 'relative' } },
                  a.a.createElement(
                    c.c,
                    null,
                    a.a.createElement(c.a, { path: '/zoomableImages' }, a.a.createElement(z, null)),
                    a.a.createElement(c.a, { path: '/largeArea' }, a.a.createElement(b, null)),
                    a.a.createElement(c.a, { path: '/longPage' }, a.a.createElement(h, null)),
                    a.a.createElement(c.a, { path: '/cameraControl' }, a.a.createElement(v, null)),
                    a.a.createElement(c.a, { path: '/bounds' }, a.a.createElement(m, null)),
                    a.a.createElement(c.a, { path: '/lowLevelEvents' }, a.a.createElement(w, null)),
                    a.a.createElement(c.a, null, a.a.createElement(A, null)),
                  ),
                ),
                a.a.createElement('div', { className: 'bottom', style: { backgroundColor: '#0bf9', height: 30 } }),
              ),
            )
          );
        }, null),
        document.getElementById('root'),
      );
    },
  },
  [[38, 1, 2]],
]);
//# sourceMappingURL=main.4d41ba35.chunk.js.map
