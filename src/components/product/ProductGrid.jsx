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
import "./product.css";
import { red500 } from "material-ui/styles/colors";

@inject("productStore")
@observer
class ProductGrid extends Component {
  state = {
    searchString: this.props.productStore.productFilter.searchString
  };
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll.bind(this));
    const { loadProductList } = this.props.productStore;
    loadProductList();
  }

  // uncomment this if we need to reset the search after tab change
  // componentWillUnmount() {
  //   const { resetProductFilter } = this.props.productStore;
  //   // resetProductFilter();
  // }

  async handleScroll() {
    let d = document.documentElement;
    let offset = d.scrollTop + window.innerHeight;
    let height = d.offsetHeight;
    const { loadNextPage, loadingMoreData } = this.props.productStore;
    if (offset === height && !loadingMoreData) {
      await loadNextPage();
    }
  }

  handleOpenEditDialog(product) {
    const { setSelectedProduct, toggleModal } = this.props.productStore;
    setSelectedProduct(product);
    toggleModal();
  }
  resetSearch() {
    const { resetProductFilter, loadProductList } = this.props.productStore;
    this.setState({ searchString: "" });
    resetProductFilter();
    loadProductList();
  }

  render() {
    const {
      productList,
      productFilter,
      onSearch,
      loading,
      loadingMoreData
    } = this.props.productStore;

    const renderTable = () => {
      if (loading) {
        return <MainProgress />;
      }

      if (productList.length === 0) {
        return <p>There are no products!</p>;
      }

      return (
        <div>
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Product Code</TableHeaderColumn>
                <TableHeaderColumn>Product Name</TableHeaderColumn>
                <TableHeaderColumn>Sales Price</TableHeaderColumn>
                <TableHeaderColumn>Quantity</TableHeaderColumn>
                <TableHeaderColumn style={editColWidth}>
                  <EditIcon style={editIconStyle} />
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} stripedRows={true}>
              {productList.map(product => (
                <TableRow key={product.id}>
                  <TableRowColumn>{product.productCode}</TableRowColumn>
                  <TableRowColumn>{product.name}</TableRowColumn>
                  <TableRowColumn>{product.salesPrice}</TableRowColumn>
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
          {loadingMoreData ? (
            <CircularProgress className="loading-data" />
          ) : (
            <br />
          )}
        </div>
      );
    };

    return (
      <div className="product-grid">
        <div className="search-box">
          <TextField
            value={this.state.searchString}
            className="search-text-field"
            disabled={
              (!productList || productList.length === 0) &&
              !productFilter.searchString
            }
            floatingLabelText="Search Products"
            hintText="Enter barcode, name or product code"
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

export default ProductGrid;
