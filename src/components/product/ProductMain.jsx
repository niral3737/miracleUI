import React, { Component } from "react";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import ProductEdit from "./ProductEdit";
import ProductGrid from "./ProductGrid";
import { FABstyle } from "../../styles";
import { inject, observer } from "mobx-react";

@inject("productStore")
@observer
class ProductMain extends Component {
  handleOpenEditDialog() {
    const { setSelectedProduct, toggleModal } = this.props.productStore;
    setSelectedProduct(null);
    toggleModal();
  }
  render() {
    return (
      <div>
        <ProductGrid />
        <ProductEdit />
        <FloatingActionButton
          style={FABstyle}
          onClick={this.handleOpenEditDialog.bind(this)}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

export default ProductMain;
