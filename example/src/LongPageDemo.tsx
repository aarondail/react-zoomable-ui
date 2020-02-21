import * as React from 'react';
import { Space}  from 'react-zoomable-ui';

const text = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis fermentum ex. Vestibulum interdum nulla quis venenatis mattis. Praesent elementum a sem vel molestie. Pellentesque eu neque eget eros sagittis sodales vel non ligula. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec lacus nec nulla congue posuere. Fusce turpis lorem, laoreet nec elit ut, lacinia efficitur velit.

Donec quis semper tellus, ac vulputate leo. Vivamus aliquet ipsum sed sollicitudin fermentum. Sed vehicula, quam vel viverra gravida, risus urna cursus mi, sed porttitor arcu dolor interdum elit. Nulla ipsum metus, sollicitudin a mi non, bibendum tristique mi. Integer posuere ipsum quis felis vulputate, eget placerat eros lacinia. Sed quis sollicitudin tortor, at hendrerit risus. Nullam et est placerat, molestie urna aliquet, dictum lorem. Donec tellus purus, accumsan vel eros vulputate, finibus feugiat mi. Phasellus erat massa, porta non finibus ut, pellentesque id sapien. Cras interdum volutpat lacus id iaculis. Sed iaculis velit eu nisi vestibulum dignissim. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam sit amet mauris dictum, tristique lectus eget, scelerisque augue. Duis luctus ac libero vel iaculis.

Quisque vitae nulla tempus, mollis elit nec, dapibus quam. Curabitur eget augue a metus aliquet suscipit in ac sapien. Vestibulum ac lectus ut arcu fringilla iaculis id nec mauris. Fusce quis lacus id sapien rhoncus molestie. Duis lacinia et magna eu molestie. In est dui, posuere et accumsan ut, faucibus sed velit. Donec id tellus sed lorem ornare efficitur. Integer sit amet odio tortor. Vestibulum tristique ex nec facilisis tristique.
`;

export const LongPageDemo = () => {
  return (
    <Space style={{ backgroundColor: 'azure' }} innerDivStyle={{ padding: 20, backgroundColor: '#fafee9' }}>
      <h6>1.</h6>
      <div>{text}</div>
      <h6>2.</h6>
      <div>{text}</div>
      <h6>3.</h6>
      <div>{text}</div>
      <h6>4.</h6>
      <div>{text}</div>
      <h6>5.</h6>
      <div>{text}</div>
      <h6>6.</h6>
      <div>{text}</div>
      <h6>7.</h6>
      <div>{text}</div>
      <h6>8.</h6>
      <div>{text}</div>
      <h6>9.</h6>
      <div>{text}</div>
      <h6>10.</h6>
      <div>{text}</div>
    </Space>
  );
};
