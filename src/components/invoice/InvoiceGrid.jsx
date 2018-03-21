import React, { Component } from "react";
import moment from "moment";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import EditIcon from "material-ui/svg-icons/editor/mode-edit";
import IconButton from "material-ui/IconButton";
import { inject, observer } from "mobx-react";
import { editIconStyle, editColWidth, tableWidth } from "../../styles";
import MainProgress from "../MainProgress";

@inject("invoiceStore")
@observer
class InvoiceGrid extends Component {
  componentDidMount() {
    const { loadInvoiceList } = this.props.invoiceStore;
    loadInvoiceList({});
  }

  handleOpenEditDialog(invoice) {
    const { setSelectedInvoice, toggleModal } = this.props.invoiceStore;
    setSelectedInvoice(invoice);
    toggleModal();
  }

  render() {
    const { invoiceList } = this.props.invoiceStore;

    if (!invoiceList) {
      return <MainProgress />;
    }

    if (invoiceList.length === 0) {
      return <p>No Invoices Yet!</p>;
    }

    return (
      <Table style={tableWidth}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Date</TableHeaderColumn>
            <TableHeaderColumn>Invoice Number</TableHeaderColumn>
            <TableHeaderColumn>Title</TableHeaderColumn>
            <TableHeaderColumn>Amount</TableHeaderColumn>
            <TableHeaderColumn style={editColWidth}>
              <EditIcon style={editIconStyle} />
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {invoiceList.map(invoice => (
            <TableRow key={invoice.id}>
              <TableRowColumn>
                {moment
                  .unix(parseInt(invoice.invoiceDate, 10) / 1000)
                  .format("DD / MMM / YYYY")}
              </TableRowColumn>
              <TableRowColumn>{invoice.invoiceNumber}</TableRowColumn>
              <TableRowColumn>{invoice.title}</TableRowColumn>
              <TableRowColumn>{invoice.totalAmount}</TableRowColumn>
              <TableRowColumn style={editColWidth}>
                <IconButton
                  onClick={this.handleOpenEditDialog.bind(this, invoice)}
                >
                  <EditIcon />
                </IconButton>
              </TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default InvoiceGrid;
