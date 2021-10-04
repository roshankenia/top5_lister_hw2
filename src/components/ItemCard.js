import React from "react";
export default class ItemCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: this.props.index,
      name: this.props.value,
      editActive: false,
    };
  }

  handleClick = (event) => {
    if (event.detail === 2) {
      this.handleToggleEdit(event);
    }
  };
  handleToggleEdit = (event) => {
    this.setState({
      editActive: !this.state.editActive,
    });
  };

  handleKeyPress = (event) => {
    if (event.code === "Enter") {
      this.handleBlur();
    }
  };
  handleBlur = () => {
    if (this.state.value) {
      let index = this.props.index;
      let textValue = this.state.value;
      this.props.renameItemCallback(index, textValue);
      this.handleToggleEdit();
    } else {
      this.handleToggleEdit();
    }
  };

  handleUpdate = (event) => {
    this.setState({ value: event.target.value });
  };

  handleDragStart = (event) => {
    event.dataTransfer.setData("index", this.state.index);
  };

  handleDrop = (event) => {
    let newIndex = this.state.index;
    let oldIndex = event.dataTransfer.getData("index");
    if (newIndex != oldIndex) {
      this.props.swapItemCallback(newIndex, oldIndex);
    }
  };

  handleDragOver = (event) => {
    event.preventDefault();

    let index = this.state.index;
    this.props.itemDragOverCallback(index);
  };

  handleDragEnd = (event) => {
    this.props.itemDragEndCallback();
  };

  render() {
    const { value, index, dragOver } = this.props;

    let dragOverClass = "";
    if (dragOver) {
      dragOverClass = "top5-item-dragged-to";
    }
    if (this.state.editActive) {
      return (
        <input
          id={"item-" + value}
          type="text"
          onKeyPress={this.handleKeyPress}
          onBlur={this.handleBlur}
          onChange={this.handleUpdate}
          defaultValue={value}
          className="top5-item"
          autoFocus
        />
      );
    } else {
      return (
        <div
          id={"item-" + index}
          className={"top5-item " + dragOverClass}
          onClick={this.handleClick}
          draggable={"true"}
          onDragStart={this.handleDragStart}
          onDrop={this.handleDrop}
          onDragOver={this.handleDragOver}
          onDragEnd={this.handleDragEnd}
        >
          {value}
        </div>
      );
    }
  }
}
