import React, { Component } from "react";
import { FlatButton, Dialog } from "material-ui";
import CustomerEdit from "../customer/CustomerEdit";
import { inject, observer } from "mobx-react";

@inject("invoiceStore")
@inject("customerStore")
@observer
class InvoiceEdit extends Component {
  render() {
    const { selectedInvoice, toggleModal, modal } = this.props.invoiceStore;
    const { toggleModal: toggleCustomerModal } = this.props.customerStore;
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
          title={!selectedInvoice ? "Create Invoice" : "Edit Invoice"}
          actions={actions}
          modal={true}
          open={modal}
        >
          dialog body
          {!selectedInvoice ? "new Invoice" : selectedInvoice.invoiceNumber}
          <FlatButton
            label="open customer edit"
            primary={true}
            onClick={toggleCustomerModal}
          />
          <CustomerEdit />
        </Dialog>
      </div>
    );
  }
}

export default InvoiceEdit;
