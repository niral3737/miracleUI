import React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

const ProductDeleteConfirmationDialog = ({
  open,
  onRequestClose,
  handleDelete,
  children
}) => {
  const actions = [
    <FlatButton label="Cancel" primary onClick={onRequestClose} />,
    <FlatButton
      label="Delete"
      secondary
      keyboardFocused={true}
      onClick={handleDelete}
    />
  ];
  return (
    <Dialog
      title="Delete Product"
      actions={actions}
      modal={false}
      open={open}
      onRequestClose={onRequestClose}
    >
      {children}
    </Dialog>
  );
};

export default ProductDeleteConfirmationDialog;
