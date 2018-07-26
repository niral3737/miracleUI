import React, { Component } from "react";
import { FlatButton, Dialog, TextField } from "material-ui";
import { observer, inject } from "mobx-react";
import "./customer.css";
import { textFieldErrorStyle } from "../../styles";
import CustomerDeleteConfirmationDialog from "./CustomerDeleteConfirmationDialog";

@inject("customerStore")
@inject("mainStore")
@observer
class CustomerEdit extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }
  async handleSubmit(e) {
    e.preventDefault();
    const { saveCustomer } = this.props.customerStore;
    await saveCustomer(false);
    this.nameRef = null;
  }

  async handleSubmitAndAdd(e) {
    e.preventDefault();
    const { saveCustomer } = this.props.customerStore;
    await saveCustomer(true);
    this.nameRef.focus();
  }

  handleCancel(e) {
    e.preventDefault();
    const { toggleModal, resetForm } = this.props.customerStore;
    toggleModal();
    resetForm();
  }
  async handleDelete(e) {
    e.preventDefault();
    const { removeCustomer } = this.props.customerStore;
    await removeCustomer();
  }
  render() {
    const {
      selectedCustomer,
      modal,
      editForm,
      onFieldChange,
      showDeleteConfirmation,
      toggleDeleteConfirmation
    } = this.props.customerStore;
    const actions = [
      <FlatButton
        label="Save and Add more"
        primary={true}
        disabled={!editForm.meta.isValid}
        onClick={this.handleSubmitAndAdd.bind(this)}
      />,
      <FlatButton
        label="Save and Close"
        primary={true}
        disabled={!editForm.meta.isValid}
        onClick={this.handleSubmit.bind(this)}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleCancel.bind(this)}
      />
    ];

    if (selectedCustomer) {
      actions.splice(
        2,
        0,
        <FlatButton
          label="Delete"
          secondary
          onClick={toggleDeleteConfirmation}
        />
      );
    }

    return (
      <Dialog
        title={!selectedCustomer ? "Create Customer" : "Edit Customer"}
        actions={actions}
        modal={true}
        open={modal}
        autoScrollBodyContent
      >
        <div className="customerEditBody">
          <h4>Customer Details</h4>
          <div>
            <TextField
              name="name"
              autoFocus={true}
              ref={input => {
                this.nameRef = input;
              }}
              floatingLabelText="Customer Name*"
              value={editForm.fields.name.value}
              errorText={editForm.fields.name.error}
              errorStyle={textFieldErrorStyle}
              onChange={e => onFieldChange(e.target.name, e.target.value)}
            />
            <TextField
              floatingLabelText="Phone number"
              name="phoneNumber"
              value={editForm.fields.phoneNumber.value}
              errorText={editForm.fields.phoneNumber.error}
              errorStyle={textFieldErrorStyle}
              onChange={e => onFieldChange(e.target.name, e.target.value)}
            />
            <TextField
              floatingLabelText="Address"
              name="address"
              value={editForm.fields.address.value}
              errorText={editForm.fields.address.error}
              errorStyle={textFieldErrorStyle}
              onChange={e => onFieldChange(e.target.name, e.target.value)}
              multiLine={true}
              rows={3}
            />
          </div>
        </div>
        <CustomerDeleteConfirmationDialog
          open={showDeleteConfirmation}
          onRequestClose={toggleDeleteConfirmation}
          handleDelete={this.handleDelete}
        >
          Are you sure you want to delete this customer?
        </CustomerDeleteConfirmationDialog>
        {editForm.meta.error && (
          <div className="errorMessage"> {editForm.meta.error} </div>
        )}
      </Dialog>
    );
  }
}
export default CustomerEdit;
