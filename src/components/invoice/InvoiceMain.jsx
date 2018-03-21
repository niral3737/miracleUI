import React, { Component } from "react";
import InvoiceGrid from "./InvoiceGrid";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import InvoiceEdit from "./InvoiceEdit";
import { FABstyle } from "../../styles";
import { inject, observer } from "mobx-react";

@inject("invoiceStore")
@observer
class InvoiceMain extends Component {
  handleOpenEditDialog() {
    const { setSelectedInvoice, toggleModal } = this.props.invoiceStore;
    setSelectedInvoice(null);
    toggleModal();
  }
  render() {
    return (
      <div>
        <InvoiceGrid />
        <InvoiceEdit />
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

export default InvoiceMain;
