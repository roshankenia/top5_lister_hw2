import React, { Component } from "react";

export default class DeleteModal extends Component {
  handleRemoveList = (event) => {
    this.props.removeListCallback(this.props.currentDeleteList);
  };

  render() {
    const { hideDeleteListModalCallback, currentDeleteList } = this.props;
    let name = "";
    if (currentDeleteList) {
      name = currentDeleteList.name;
    }
    return (
      <div className="modal" id="delete-modal" data-animation="slideInOutLeft">
        <div className="modal-dialog">
          <header className="dialog-header">
            Delete the Top 5 {name} List?
          </header>
          <div id="confirm-cancel-container">
            <button
              id="dialog-yes-button"
              className="modal-button"
              onClick={this.handleRemoveList}
            >
              Confirm
            </button>
            <button
              id="dialog-no-button"
              className="modal-button"
              onClick={hideDeleteListModalCallback}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}
