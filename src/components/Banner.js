import React from "react";
import EditToolbar from "./EditToolbar";

export default class Banner extends React.Component {
  render() {
    const { title, undoCallback, redoCallback, closeCallback, hasUndo, hasRedo, hasClose } = this.props;
    return (
      <div id="top5-banner">
        {title}
        <EditToolbar
          closeCallback={closeCallback}
          undoCallback={undoCallback}
          redoCallback={redoCallback}
          hasUndo={hasUndo}
          hasRedo={hasRedo}
          hasClose={hasClose}
        />
      </div>
    );
  }
}
