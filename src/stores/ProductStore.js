import { observable, action, runInAction } from "mobx";
import axios from "axios";
import Validator from "validatorjs";

class ProductStore {
  @observable productList = null;
  @observable modal = false;
  @observable selectedProduct = null;
  @observable editForm = this.setNewForm();
  @observable productFilter = {};

  @action
  onFieldChange = (field, value) => {
    this.editForm.fields[field].value = value;
    let { productName, price, quantity } = this.editForm.fields;
    var validation = new Validator(
      {
        productName: productName.value,
        price: price.value,
        quantity: quantity.value
      },
      {
        productName: productName.rule,
        price: price.rule,
        quantity: quantity.rule
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
        productName: {
          value: !this.selectedProduct ? "" : this.selectedProduct.name,
          error: null,
          rule: "required"
        },
        price: {
          value: !this.selectedProduct ? "" : this.selectedProduct.price,
          error: null,
          rule: "required|numeric|min:0"
        },
        quantity: {
          value: !this.selectedProduct ? "" : this.selectedProduct.quantity,
          error: null,
          rule: "required|integer|min:0"
        },
        hsnCode: {
          value: !this.selectedProduct ? "" : this.selectedProduct.hsnCode,
          error: null,
          rule: null
        },
        barcode: {
          value: !this.selectedProduct ? "" : this.selectedProduct.barcode,
          error: null,
          rule: null
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
  closeModal = () => {
    this.modal = false;
  };

  @action
  setSelectedProduct = product => {
    this.selectedProduct = product;
    this.resetForm();
  };

  @action
  loadProductList = async () => {
    const response = await axios.post(
      "/webapi/product/get",
      this.productFilter
    );
    runInAction(() => {
      this.productList = response.data;
    });
  };

  @action
  saveProduct = async () => {
    let product = this.getProductFromEditForm();
    const response = await axios.post("webapi/product/set", product);
    this.loadProductList(this.productFilter);
    return response.data;
  };

  @action
  removeProduct = async () => {
    if (this.selectedProduct) {
      await axios.delete(`webapi/product/remove/${this.selectedProduct.id}`);
    }
    this.loadProductList(this.productFilter);
  };

  getProductFromEditForm = () => {
    return {
      id: !this.selectedProduct ? 0 : this.selectedProduct.id,
      name: this.editForm.fields.productName.value,
      hsnCode: this.editForm.fields.hsnCode.value,
      barcode: this.editForm.fields.barcode.value,
      location: this.editForm.fields.location.value,
      price: parseFloat(this.editForm.fields.price.value, 10),
      quantity: parseInt(this.editForm.fields.quantity.value, 10)
    };
  };
}

const productStore = new ProductStore();
export default productStore;
