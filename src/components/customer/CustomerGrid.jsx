import React, { Component } from "react";
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
import "./customer.css";
import { red500 } from "material-ui/styles/colors";

@inject("customerStore")
@observer
class CustomerGrid extends Component {
  state = {
    searchString: this.props.customerStore.customerFilter.searchString
  };
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll.bind(this));
    const { loadCustomerList } = this.props.customerStore;
    loadCustomerList();
  }

  async handleScroll() {
    let d = document.documentElement;
    let offset = d.scrollTop + window.innerHeight;
    let height = d.offsetHeight;
    const { loadNextPage, loadingMoreData } = this.props.customerStore;
    if (offset === height && !loadingMoreData) {
      await loadNextPage();
    }
  }

  handleOpenEditDialog(customer) {
    const { setSelectedCustomer, toggleModal } = this.props.customerStore;
    setSelectedCustomer(customer);
    toggleModal();
  }

  resetSearch() {
    const { resetCustomerFilter, loadCustomerList } = this.props.customerStore;
    this.setState({ searchString: "" });
    resetCustomerFilter();
    loadCustomerList();
  }

  render() {
    const {
      customerList,
      customerFilter,
      onSearch,
      loading,
      loadingMoreData
    } = this.props.customerStore;

    const renderTable = () => {
      if (loading) {
        return <MainProgress />;
      }

      if (customerList.length === 0) {
        return <p>There are no customers!</p>;
      }

      return (
        <div>
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Phone Number</TableHeaderColumn>
                <TableHeaderColumn style={editColWidth}>
                  <EditIcon style={editIconStyle} />
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} stripedRows={true}>
              {customerList.map(customer => (
                <TableRow key={customer.id}>
                  <TableRowColumn>{customer.name}</TableRowColumn>
                  <TableRowColumn>{customer.phoneNumber}</TableRowColumn>
                  <TableRowColumn style={editColWidth}>
                    <IconButton
                      onClick={this.handleOpenEditDialog.bind(this, customer)}
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
      <div className="customer-grid">
        <div className="search-box">
          <TextField
            value={this.state.searchString}
            className="search-text-field"
            disabled={
              (!customerList || customerList.length === 0) &&
              !customerFilter.searchString
            }
            floatingLabelText="Search Customers"
            hintText="Enter name or address"
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

export default CustomerGrid;
