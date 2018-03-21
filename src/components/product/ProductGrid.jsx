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

@inject("productStore")
@observer
class ProductGrid extends Component {
  componentDidMount() {
    const { loadProductList } = this.props.productStore;
    loadProductList({});
  }

  handleOpenEditDialog(product) {
    const { setSelectedProduct, toggleModal } = this.props.productStore;
    setSelectedProduct(product);
    toggleModal();
  }
  render() {
    const { productList } = this.props.productStore;

    if (!productList) {
      return <MainProgress />;
    }

    if (productList.length === 0) {
      return <p>No Products Yet!</p>;
    }

    return (
      <Table style={tableWidth}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Price</TableHeaderColumn>
            <TableHeaderColumn>Quantity</TableHeaderColumn>
            <TableHeaderColumn style={editColWidth}>
              <EditIcon style={editIconStyle} />
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {productList.map(product => (
            <TableRow key={product.id}>
              <TableRowColumn>{product.name}</TableRowColumn>
              <TableRowColumn>{product.price}</TableRowColumn>
              <TableRowColumn>{product.quantity}</TableRowColumn>
              <TableRowColumn style={editColWidth}>
                <IconButton
                  onClick={this.handleOpenEditDialog.bind(this, product)}
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

export default ProductGrid;
