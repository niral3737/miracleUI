import React, { Component } from "react";
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

@inject("customerStore")
@observer
class CustomerGrid extends Component {
  componentDidMount() {
    const { loadCustomerList } = this.props.customerStore;
    loadCustomerList({});
  }

  handleOpenEditDialog(customer) {
    const { setSelectedCustomer, toggleModal } = this.props.customerStore;
    setSelectedCustomer(customer);
    toggleModal();
  }

  render() {
    const { customerList } = this.props.customerStore;

    if (!customerList) {
      return <MainProgress />;
    }

    if (customerList.length === 0) {
      return <p>No Customers Yet!</p>;
    }
    return (
      <Table style={tableWidth}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Phone Number</TableHeaderColumn>
            <TableHeaderColumn style={editColWidth}>
              <EditIcon style={editIconStyle} />
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
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
    );
  }
}

export default CustomerGrid;
