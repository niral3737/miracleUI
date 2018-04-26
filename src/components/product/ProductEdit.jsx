import React, { Component } from "react";
import {
  FlatButton,
  Dialog,
  SelectField,
  MenuItem,
  TextField
} from "material-ui";
import { observer, inject } from "mobx-react";
import "./product.css";
import { textFieldErrorStyle } from "../../styles";
import ProductDeleteConfirmationDialog from "./ProductDeleteConfirmationDialog";

@inject("productStore")
@inject("mainStore")
@observer
class ProductEdit extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.quantityRef = null;
    this.nameRef = null;
  }
  async handleSubmit(e) {
    e.preventDefault();
    const { saveProduct } = this.props.productStore;
    await saveProduct(false);
  }

  async handleSubmitAndAdd(e) {
    e.preventDefault();
    const { saveProduct } = this.props.productStore;
    await saveProduct(true);
    this.nameRef.focus();
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

    if (selectedProduct) {
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
        title={!selectedProduct ? "Create Product" : "Edit Product"}
        actions={actions}
        modal={true}
        open={modal}
        autoScrollBodyContent
      >
        <div className="productEditBody">
          <h4>Product Details</h4>
          <div>
            <TextField
              name="name"
              autoFocus={true}
              ref={input => {
                this.nameRef = input;
              }}
              floatingLabelText="Product Name*"
              value={editForm.fields.name.value}
              errorText={editForm.fields.name.error}
              errorStyle={textFieldErrorStyle}
              onChange={e => onFieldChange(e.target.name, e.target.value)}
            />
            <TextField
              floatingLabelText="Product Code*"
              name="productCode"
              value={editForm.fields.productCode.value}
              errorText={editForm.fields.productCode.error}
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
          </div>
          <h4>Rate</h4>
          <div>
            <div>
              <span>₹</span>
              <TextField
                style={{ marginLeft: "0.2rem" }}
                floatingLabelText="Purchase Price(₹)"
                type="number"
                name="purchasePrice"
                value={editForm.fields.purchasePrice.value}
                errorText={editForm.fields.purchasePrice.error}
                errorStyle={textFieldErrorStyle}
                onChange={e => onFieldChange(e.target.name, e.target.value)}
              />
            </div>

            <div>
              <span>₹</span>
              <TextField
                style={{ marginLeft: "0.2rem" }}
                floatingLabelText="Sales Price(₹)*"
                type="number"
                name="salesPrice"
                value={editForm.fields.salesPrice.value}
                errorText={editForm.fields.salesPrice.error}
                errorStyle={textFieldErrorStyle}
                onChange={e => onFieldChange(e.target.name, e.target.value)}
              />
            </div>
            <SelectField
              floatingLabelText="GST Slab"
              value={editForm.fields.gstSlab.value}
              errorText={editForm.fields.gstSlab.error}
              errorStyle={textFieldErrorStyle}
              onChange={(e, index, value) => {
                e.preventDefault();
                onFieldChange("gstSlab", value);
                setTimeout(() => this.quantityRef.focus(), 100);
              }}
            >
              <MenuItem value={"NONGST"} primaryText="Not Applicable" />
              <MenuItem value={"GST5"} primaryText="5% GST" />
              <MenuItem value={"GST12"} primaryText="12% GST" />
              <MenuItem value={"GST18"} primaryText="18% GST" />
              <MenuItem value={"GST28"} primaryText="28% GST" />
              <MenuItem value={"GST3"} primaryText="3% GST" />
              <MenuItem value={"GSTNILL"} primaryText="0% GST" />
            </SelectField>
          </div>
          <h4>Inventory</h4>
          <div>
            <TextField
              floatingLabelText="Quantity*"
              type="number"
              name="quantity"
              ref={input => {
                this.quantityRef = input;
              }}
              value={editForm.fields.quantity.value}
              errorText={editForm.fields.quantity.error}
              errorStyle={textFieldErrorStyle}
              onChange={e => onFieldChange(e.target.name, e.target.value)}
            />
            <TextField
              floatingLabelText="Location of product in shop"
              name="location"
              value={editForm.fields.location.value}
              errorText={editForm.fields.location.error}
              errorStyle={textFieldErrorStyle}
              onChange={e => onFieldChange(e.target.name, e.target.value)}
            />
          </div>
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
