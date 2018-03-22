import React, { Component } from "react";
import { FlatButton, Dialog } from "material-ui";
import { observer, inject } from "mobx-react";
import TextField from "material-ui/TextField";
import "./productEdit.css";
import { textFieldErrorStyle } from "../../styles";
import ProductDeleteConfirmationDialog from "./ProductDeleteConfirmationDialog";

@inject("productStore")
@inject("mainStore")
@observer
class ProductEdit extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }
  async handleSubmit(e) {
    e.preventDefault();
    const { saveProduct } = this.props.productStore;
    await saveProduct();
  }

  handleCancel(e) {
    e.preventDefault();
    const { toggleModal, resetForm } = this.props.productStore;
    toggleModal();
    resetForm();
  }
  async handleDelete(e) {
    e.preventDefault();
    const { removeProduct } = this.props.productStore;
    await removeProduct();
  }
  render() {
    const {
      selectedProduct,
      modal,
      editForm,
      onFieldChange,
      showDeleteConfirmation,
      toggleDeleteConfirmation
    } = this.props.productStore;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleCancel.bind(this)}
      />,
      <FlatButton
        label="Save"
        primary={true}
        disabled={!editForm.meta.isValid}
        onClick={this.handleSubmit.bind(this)}
      />
    ];

    if (selectedProduct) {
      actions.splice(
        1,
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
        title={!selectedProduct ? "Create Product" : "Edit Product"}
        actions={actions}
        modal={true}
        open={modal}
      >
        <div className="productEditBody">
          <TextField
            name="name"
            floatingLabelText="Product Name*"
            value={editForm.fields.name.value}
            errorText={editForm.fields.name.error}
            errorStyle={textFieldErrorStyle}
            onChange={e => onFieldChange(e.target.name, e.target.value)}
          />
          <span>₹</span>
          <TextField
            style={{ marginLeft: "0.2rem" }}
            floatingLabelText="Price(₹)*"
            type="number"
            name="price"
            value={editForm.fields.price.value}
            errorText={editForm.fields.price.error}
            errorStyle={textFieldErrorStyle}
            onChange={e => onFieldChange(e.target.name, e.target.value)}
          />
          <TextField
            floatingLabelText="Quantity*"
            type="number"
            name="quantity"
            value={editForm.fields.quantity.value}
            errorText={editForm.fields.quantity.error}
            errorStyle={textFieldErrorStyle}
            onChange={e => onFieldChange(e.target.name, e.target.value)}
          />
          <TextField
            floatingLabelText="HSN code"
            name="hsnCode"
            value={editForm.fields.hsnCode.value}
            errorText={editForm.fields.hsnCode.error}
            errorStyle={textFieldErrorStyle}
            onChange={e => onFieldChange(e.target.name, e.target.value)}
          />
          <TextField
            floatingLabelText="Barcode"
            name="barcode"
            value={editForm.fields.barcode.value}
            errorText={editForm.fields.barcode.error}
            errorStyle={textFieldErrorStyle}
            onChange={e => onFieldChange(e.target.name, e.target.value)}
          />
          <TextField
            floatingLabelText="Location"
            name="location"
            value={editForm.fields.location.value}
            errorText={editForm.fields.location.error}
            errorStyle={textFieldErrorStyle}
            onChange={e => onFieldChange(e.target.name, e.target.value)}
          />
        </div>
        <ProductDeleteConfirmationDialog
          open={showDeleteConfirmation}
          onRequestClose={toggleDeleteConfirmation}
          handleDelete={this.handleDelete}
        >
          Are you sure you want to delete this product?
        </ProductDeleteConfirmationDialog>
        {editForm.meta.error && (
          <div className="errorMessage"> {editForm.meta.error} </div>
        )}
      </Dialog>
    );
  }
}

export default ProductEdit;
