import React from "react";

export default class Workspace extends React.Component {
  render() {
    const { currentList } = this.props;

    if (currentList) {
      return (
        <div id="top5-workspace">
          <div id="workspace-edit">
            <div id="edit-numbering">
              <div className="item-number">1.</div>
              <div className="item-number">2.</div>
              <div className="item-number">3.</div>
              <div className="item-number">4.</div>
              <div className="item-number">5.</div>
            </div>
            <div id = "edit-items">
                <div id="item-1" class="top5-item" draggable="true">{currentList.items[0]}</div>
                <div id="item-2" class="top5-item" draggable="true">{currentList.items[1]}</div>
                <div id="item-3" class="top5-item" draggable="true">{currentList.items[2]}</div>
                <div id="item-4" class="top5-item" draggable="true">{currentList.items[3]}</div>
                <div id="item-5" class="top5-item" draggable="true">{currentList.items[4]}</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div id="top5-workspace">
          <div id="workspace-edit">
            <div id="edit-numbering">
              <div className="item-number">1.</div>
              <div className="item-number">2.</div>
              <div className="item-number">3.</div>
              <div className="item-number">4.</div>
              <div className="item-number">5.</div>
            </div>
          </div>
        </div>
      );
    }
  }
}
