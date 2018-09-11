import { observable, action, runInAction } from "mobx";
import axios from "axios";
import debounce from "lodash/debounce";
import Validator from "validatorjs";
import mainStore from "./MainStore";

const PAGE_SIZE = 50;
const INITIAL_PAGING_OFFSET_PRODUCT_ID = 0;

class ProductStore {
  @observable
  loading = false;
  @observable
  loadingMoreData = false;
  @observable
  productList = [];
  @observable
  modal = false;
  @observable
  selectedProduct = null;
  @observable
  editForm = this.setNewForm();
  @observable
  productFilter = this.setNewProductFilter();
  @observable
  showDeleteConfirmation = false;
  @observable
  searchString = "";

  @action
  onFieldChange = (field, value) => {
    this.editForm.fields[field].value = value;
    let {
      name,
      productCode,
      salesPrice,
      quantity,
      purchasePrice
    } = this.editForm.fields;
    var validation = new Validator(
      {
        name: name.value,
        productCode: productCode.value,
        salesPrice: salesPrice.value,
        quantity: quantity.value,
        purchasePrice: purchasePrice.value
      },
      {
        name: name.rule,
        productCode: productCode.rule,
        salesPrice: salesPrice.rule,
        quantity: quantity.rule,
        purchasePrice: purchasePrice.rule
      }
    );
    this.editForm.meta.isValid = validation.passes();
    this.editForm.fields[field].error = validation.errors.first(field);
  };

  @action
  resetForm = () => {
    this.editForm = this.setNewForm();
  };

  setNewForm = () => {
    return {
      fields: {
        name: {
          value: !this.selectedProduct ? "" : this.selectedProduct.name,
          error: null,
          rule: "required"
        },
        productCode: {
          value: !this.selectedProduct ? "" : this.selectedProduct.productCode,
          error: null,
          rule: "required"
        },
        barcode: {
          value: !this.selectedProduct ? "" : this.selectedProduct.barcode,
          error: null,
          rule: null
        },
        purchasePrice: {
          value: !this.selectedProduct
            ? ""
            : this.selectedProduct.purchasePrice,
          error: null,
          rule: "numeric|min:0"
        },
        salesPrice: {
          value: !this.selectedProduct ? "" : this.selectedProduct.salesPrice,
          error: null,
          rule: "required|numeric|min:0"
        },
        gstSlab: {
          value: !this.selectedProduct
            ? "NONGST"
            : this.selectedProduct.gstSlab,
          error: null,
          rule: null
        },
        quantity: {
          value: !this.selectedProduct ? "" : this.selectedProduct.quantity,
          error: null,
          rule: "required|integer|min:0"
        },
        location: {
          value: !this.selectedProduct ? "" : this.selectedProduct.location,
          error: null,
          rule: null
        }
      },
      meta: {
        isValid: false,
        error: null
      }
    };
  };

  @action
  toggleModal = () => {
    this.modal = !this.modal;
  };

  @action
  toggleDeleteConfirmation = () => {
    this.showDeleteConfirmation = !this.showDeleteConfirmation;
  };

  @action
  setSelectedProduct = product => {
    this.selectedProduct = product;
    this.resetForm();
  };

  @action
  loadProductList = async () => {
    this.loading = true;
    const response = await axios.post(
      "/webapi/product/get",
      this.productFilter
    );
    if (response.data.ok) {
      runInAction(() => {
        this.productList = response.data.payload;
      });
    } else {
      console.log("There is some error");
    }
    this.loading = false;
  };

  @action
  loadNextPage = async () => {
    if (this.productList.length % PAGE_SIZE !== 0) return;

    this.loadingMoreData = true;
    this.productFilter.pagingOffsetProductId = this.productList[
      this.productList.length - 1
    ].id;
    const response = await axios.post(
      "/webapi/product/get",
      this.productFilter
    );
    if (response.data.ok) {
      runInAction(() => {
        if (response.data.payload.length !== 0) {
          response.data.payload.forEach(product => {
            this.productList.push(product);
          });
        }
      });
    } else {
      console.log("There is some error");
    }
    this.loadingMoreData = false;
  };
  @action
  saveProduct = async addMore => {
    let product = this.getProductFromEditForm();
    const response = await axios.post("webapi/product/set", product);
    if (response.data.ok) {
      this.resetProductFilter();
      this.loadProductList(this.productFilter);
      if (!this.selectedProduct) {
        mainStore.showSnackBar(`Product Created`);
      } else {
        mainStore.showSnackBar("Product Updated");
      }

      if (!addMore) {
        this.toggleModal();
      }
      this.selectedProduct = null;
      this.resetForm();
    } else {
      response.data.payload.forEach(violation => {
        this.editForm.fields[violation.dataFieldName].error =
          violation.errorMessage;
      });
    }
  };

  @action
  removeProduct = async () => {
    this.toggleDeleteConfirmation();
    if (this.selectedProduct) {
      const response = await axios.delete(
        `webapi/product/remove/${this.selectedProduct.id}`
      );
      if (response.data.ok) {
        this.resetProductFilter();
        this.loadProductList(this.productFilter);
        mainStore.showSnackBar("Product Deleted");
        this.toggleModal();
        this.resetForm();
      } else {
        this.editForm.meta.error = response.data.payload[0].errorMessage;
      }
    }
  };

  getProductFromEditForm = () => {
    return {
      id: !this.selectedProduct ? 0 : this.selectedProduct.id,
      name: this.editForm.fields.name.value,
      productCode: this.editForm.fields.productCode.value,
      barcode: this.editForm.fields.barcode.value,
      purchasePrice: parseFloat(this.editForm.fields.purchasePrice.value, 10),
      salesPrice: parseFloat(this.editForm.fields.salesPrice.value, 10),
      gstSlab: this.editForm.fields.gstSlab.value,
      quantity: parseInt(this.editForm.fields.quantity.value, 10),
      location: this.editForm.fields.location.value
    };
  };

  @action
  resetProductFilter = () => {
    this.productFilter = this.setNewProductFilter();
  };

  setNewProductFilter() {
    return {
      pagingOffsetProductId: INITIAL_PAGING_OFFSET_PRODUCT_ID,
      limit: PAGE_SIZE
    };
  }

  @action
  onSearch = searchString => {
    this.resetProductFilter();
    this.productFilter.searchString = searchString;
    this.debounceApiCall(this.loadProductList);
  };

  debounceApiCall = debounce(call => call(), 500);

  setSearchString = value => {
    this.productFilter.searchString = value;
  };
}

const productStore = new ProductStore();
export default productStore;
