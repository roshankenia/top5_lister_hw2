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
    let index = this.props.index;
    let textValue = this.state.value;
    this.props.renameItemCallback(index, textValue);
    this.handleToggleEdit();
  };

  handleUpdate = (event) => {
    this.setState({ value: event.target.value });
  };

  render() {
    const { value, index } = this.props;
    if (this.state.editActive) {
      return (
        <input
          id={"item-" + value}
          type="text"
          onKeyPress={this.handleKeyPress}
          onBlur={this.handleBlur}
          onChange={this.handleUpdate}
          defaultValue={value}
        />
      );
    } else {
      return (
        <div
          id={"item-" + index}
          className={"top5-item"}
          onClick={this.handleClick}
        >
          {value}
        </div>
      );
    }
  }
}
