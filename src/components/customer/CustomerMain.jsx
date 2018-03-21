import React, { Component } from "react";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import CustomerGrid from "./CustomerGrid";
import CustomerEdit from "./CustomerEdit";
import { observer, inject } from "mobx-react";
import { FABstyle } from "../../styles";

@inject("customerStore")
@observer
class CustomerMain extends Component {
  handleOpenEditDialog() {
    const { setSelectedCustomer, toggleModal } = this.props.customerStore;
    setSelectedCustomer(null);
    toggleModal();
  }
  render() {
    return (
      <div>
        <CustomerGrid />
        <CustomerEdit />
        <FloatingActionButton
          style={FABstyle}
          onClick={this.handleOpenEditDialog.bind(this)}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}
export default CustomerMain;
