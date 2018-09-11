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
import { TextField, CircularProgress } from "material-ui";
import EditIcon from "material-ui/svg-icons/editor/mode-edit";
import CloseIcon from "material-ui/svg-icons/navigation/close";
import IconButton from "material-ui/IconButton";
import { inject, observer } from "mobx-react";
import { editIconStyle, editColWidth } from "../../styles";
import MainProgress from "../MainProgress";
import "./invoice.css";
import { red500 } from "material-ui/styles/colors";

@inject("invoiceStore")
@observer
class InvoiceGrid extends Component {
  state = {
    searchString: this.props.invoiceStore.invoiceFilter.searchString
  };
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll.bind(this));
    const { loadInvoiceList } = this.props.invoiceStore;
    loadInvoiceList();
  }

  async handleScroll() {
    let d = document.documentElement;
    let offset = d.scrollTop + window.innerHeight;
    let height = d.offsetHeight;
    const { loadNextPage, loadingMoreData } = this.props.invoiceStore;
    if (offset === height && !loadingMoreData) {
      await loadNextPage();
    }
  }

  handleOpenEditDialog(invoice) {
    const { setSelectedInvoice, toggleModal } = this.props.invoiceStore;
    setSelectedInvoice(invoice);
    toggleModal();
  }

  resetSearch() {
    const { resetInvoiceFilter, loadInvoiceList } = this.props.invoiceStore;
    this.setState({ searchString: "" });
    resetInvoiceFilter();
    loadInvoiceList();
  }

  render() {
    const {
      invoiceList,
      invoiceFilter,
      onSearch,
      loading,
      loadingMoreData
    } = this.props.invoiceStore;

    const renderTable = () => {
      if (loading) {
        return <MainProgress />;
      }

      if (invoiceList.length === 0) {
        return <p>There are no invoices!</p>;
      }

      return (
        <div>
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Date</TableHeaderColumn>
                <TableHeaderColumn>Invoice Number</TableHeaderColumn>
                <TableHeaderColumn>Title</TableHeaderColumn>
                <TableHeaderColumn>Customer Name</TableHeaderColumn>
                <TableHeaderColumn>Amount</TableHeaderColumn>
                <TableHeaderColumn style={editColWidth}>
                  <EditIcon style={editIconStyle} />
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} stripedRows={true}>
              {invoiceList.map(invoice => (
                <TableRow key={invoice.id}>
                  <TableRowColumn>
                    {moment
                      .unix(parseInt(invoice.invoiceDate, 10) / 1000)
                      .format("DD / MMM / YYYY")}
                  </TableRowColumn>
                  <TableRowColumn>{invoice.invoiceNumber}</TableRowColumn>
                  <TableRowColumn>{invoice.title}</TableRowColumn>
                  <TableRowColumn>{invoice.customerName}</TableRowColumn>
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
          {loadingMoreData ? (
            <CircularProgress className="loading-data" />
          ) : (
            <br />
          )}
        </div>
      );
    };

    return (
      <div className="invoice-grid">
        <div className="search-box">
          <TextField
            value={this.state.searchString}
            className="search-text-field"
            disabled={
              (!invoiceList || invoiceList.length === 0) &&
              !invoiceFilter.searchString
            }
            floatingLabelText="Search Invoices"
            hintText="Enter invoice number, customer name or amount"
            autoFocus={true}
            onChange={e => {
              this.setState({ searchString: e.target.value });
              onSearch(e.target.value);
            }}
          />
          <IconButton
            onClick={this.resetSearch.bind(this)}
            disabled={!this.state.searchString}
          >
            <CloseIcon color={red500} />
          </IconButton>
        </div>
        {renderTable()}
      </div>
    );
  }
}

export default InvoiceGrid;
