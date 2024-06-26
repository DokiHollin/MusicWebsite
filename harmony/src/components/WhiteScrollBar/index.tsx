import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

interface WhiteScrollBarProps extends React.HTMLProps<Scrollbars> {
  fullHeight?: boolean;
}

function WhiteScrollBar(props: WhiteScrollBarProps) {
  return (
    <Scrollbars
      style={{ width: '100%', height: '100%',overflow:'auto',maxHeight:'80%' }}
      renderTrackVertical={(prop) => (
        <div
          {...prop}
          className={`white_scroll_track-vertical ${
            prop.fullHeight ? 'full_height' : ''
          }`}
        />
      )}
      renderThumbVertical={(props) => (
        <div {...props} className="white_scroll_thumb-vertical" />
      )}
      className="white_scroll"
    >
      {props.children}
    </Scrollbars>
  );
}

export default WhiteScrollBar;
