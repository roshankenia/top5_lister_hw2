import React from "react";

export default class EditToolbar extends React.Component {
  render() {
    const {
      undoCallback,
      redoCallback,
      closeCallback,
      hasUndo,
      hasRedo,
      hasClose,
    } = this.props;

    if (hasUndo) {
      if (hasRedo) {
        if (hasClose) {
          return (
            <div id="edit-toolbar">
              <div
                id="undo-button"
                className="top5-button"
                onClick={undoCallback}
              >
                &#x21B6;
              </div>
              <div
                id="redo-button"
                className="top5-button"
                onClick={redoCallback}
              >
                &#x21B7;
              </div>
              <div
                id="close-button"
                className="top5-button"
                onClick={closeCallback}
              >
                &#x24E7;
              </div>
            </div>
          );
        } else {
          return (
            <div id="edit-toolbar">
              <div
                id="undo-button"
                className="top5-button"
                onClick={undoCallback}
              >
                &#x21B6;
              </div>
              <div
                id="redo-button"
                className="top5-button"
                onClick={redoCallback}
              >
                &#x21B7;
              </div>
              <div id="close-button" className="top5-button-disabled">
                &#x24E7;
              </div>
            </div>
          );
        }
      } else {
        if (hasClose) {
          return (
            <div id="edit-toolbar">
              <div
                id="undo-button"
                className="top5-button"
                onClick={undoCallback}
              >
                &#x21B6;
              </div>
              <div id="redo-button" className="top5-button-disabled">
                &#x21B7;
              </div>
              <div
                id="close-button"
                className="top5-button"
                onClick={closeCallback}
              >
                &#x24E7;
              </div>
            </div>
          );
        } else {
          return (
            <div id="edit-toolbar">
              <div
                id="undo-button"
                className="top5-button"
                onClick={undoCallback}
              >
                &#x21B6;
              </div>
              <div id="redo-button" className="top5-button-disabled">
                &#x21B7;
              </div>
              <div id="close-button" className="top5-button-disabled">
                &#x24E7;
              </div>
            </div>
          );
        }
      }
    } else {
      if (hasRedo) {
        if (hasClose) {
          return (
            <div id="edit-toolbar">
              <div id="undo-button" className="top5-button-disabled">
                &#x21B6;
              </div>
              <div
                id="redo-button"
                className="top5-button"
                onClick={redoCallback}
              >
                &#x21B7;
              </div>
              <div
                id="close-button"
                className="top5-button"
                onClick={closeCallback}
              >
                &#x24E7;
              </div>
            </div>
          );
        } else {
          return (
            <div id="edit-toolbar">
              <div id="undo-button" className="top5-button-disabled">
                &#x21B6;
              </div>
              <div
                id="redo-button"
                className="top5-button"
                onClick={redoCallback}
              >
                &#x21B7;
              </div>
              <div id="close-button" className="top5-button-disabled">
                &#x24E7;
              </div>
            </div>
          );
        }
      } else {
        if (hasClose) {
          return (
            <div id="edit-toolbar">
              <div id="undo-button" className="top5-button-disabled">
                &#x21B6;
              </div>
              <div id="redo-button" className="top5-button-disabled">
                &#x21B7;
              </div>
              <div
                id="close-button"
                className="top5-button"
                onClick={closeCallback}
              >
                &#x24E7;
              </div>
            </div>
          );
        } else {
          return (
            <div id="edit-toolbar">
              <div id="undo-button" className="top5-button-disabled">
                &#x21B6;
              </div>
              <div id="redo-button" className="top5-button-disabled">
                &#x21B7;
              </div>
              <div id="close-button" className="top5-button-disabled">
                &#x24E7;
              </div>
            </div>
          );
        }
      }
    }
  }
}
