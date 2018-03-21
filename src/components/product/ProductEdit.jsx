import React, { Component } from "react";
import { FlatButton, Dialog } from "material-ui";
import { observer, inject } from "mobx-react";
import TextField from "material-ui/TextField";
import "./productEdit.css";
import { textFieldErrorStyle } from "../../styles";

@inject("productStore")
@inject("mainStore")
@observer
class ProductEdit extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }
  async handleSubmit() {
    const { toggleModal, saveProduct, resetForm } = this.props.productStore;
    await saveProduct();
    toggleModal();
    resetForm();
  }

  handleCancel() {
    const { toggleModal, resetForm } = this.props.productStore;
    toggleModal();
    resetForm();
  }
  async handleDelete() {
    const { toggleModal, resetForm, removeProduct } = this.props.productStore;
    const { showSnackBar } = this.props.mainStore;
    await removeProduct();
    showSnackBar("Product Deleted");
    toggleModal();
    resetForm();
  }
  render() {
    const {
      selectedProduct,
      modal,
      editForm,
      onFieldChange
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
        <FlatButton label="Delete" secondary onClick={this.handleDelete} />
      );
    }

    return (
      <div>
        <Dialog
          title={!selectedProduct ? "Create Product" : "Edit Product"}
          actions={actions}
          modal={true}
          open={modal}
        >
          <div className="productEditBody">
            <TextField
              name="productName"
              floatingLabelText="Product Name*"
              value={editForm.fields.productName.value}
              errorText={editForm.fields.productName.error}
              errorStyle={textFieldErrorStyle}
              onChange={e => onFieldChange(e.target.name, e.target.value)}
            />
            <TextField
              floatingLabelText="HSN code"
              name="hsnCode"
              value={editForm.fields.hsnCode.value}
              onChange={e => onFieldChange(e.target.name, e.target.value)}
            />
            <TextField
              floatingLabelText="Barcode"
              name="barcode"
              value={editForm.fields.barcode.value}
              onChange={e => onFieldChange(e.target.name, e.target.value)}
            />
            <TextField
              floatingLabelText="Location"
              name="location"
              value={editForm.fields.location.value}
              onChange={e => onFieldChange(e.target.name, e.target.value)}
            />
            {/* <div className=".price .productEditBody"> */}
            <span>₹</span>
            <TextField
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
          </div>
          {/* </div> */}
        </Dialog>
      </div>
    );
  }
}

export default ProductEdit;
