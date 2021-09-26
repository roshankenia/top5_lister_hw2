import React from "react";
export default class ItemCard extends React.Component {
  constructor(props) {
    super(props);

     this.state = {
       index: this.props.index,
       name: this.props.value
     };
  }
  render() {
    const {value, index} = this.props;
    return (
      <div id={"item-"+index} className={"top5-item"}>
        {value}
      </div>
    );
  }
}
