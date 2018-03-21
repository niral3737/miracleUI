import React, { Component } from "react";
import { FlatButton, Dialog } from "material-ui";
import { observer, inject } from "mobx-react";

@inject("customerStore")
@observer
class CustomerEdit extends Component {
  render() {
    const { selectedCustomer, toggleModal, modal } = this.props.customerStore;
    const actions = [
      <FlatButton label="Cancel" primary={true} onClick={toggleModal} />,
      <FlatButton
        label="Save"
        primary={true}
        disabled={true}
        onClick={toggleModal}
      />
    ];

    return (
      <div>
        <Dialog
          title={!selectedCustomer ? "Create Customer" : "Edit Customer"}
          actions={actions}
          modal={true}
          open={modal}
        >
          dialog body
        </Dialog>
      </div>
    );
  }
}
export default CustomerEdit;
