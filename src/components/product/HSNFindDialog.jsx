import React, { Component } from "react";
import {
  FlatButton,
  Dialog,
  SelectField,
  MenuItem,
  TextField
} from "material-ui";

const HSNFindDialog = ({ open, onRequestClose, onSaveAndApply }) => {
  const actions = [
    <FlatButton label="Cancel" primary={true} onClick={this.handleClose} />,
    <FlatButton
      label="Save & Apply"
      primary={true}
      keyboardFocused={true}
      onClick={this.handleClose}
    />
  ];
  return (
    <Dialog
      title="Find HSN code"
      actions={actions}
      modal={false}
      open={open}
      onRequestClose={this.handleClose}
    >
      <TextField
        floatingLabelText="HSN Code"
        name="hsnCode"
        value={editForm.fields.salesPrice.value}
        errorText={editForm.fields.salesPrice.error}
        errorStyle={textFieldErrorStyle}
        onChange={e => onFieldChange(e.target.name, e.target.value)}
      />
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
    </Dialog>
  );
};

export default HSNFindDialog;
