import { observable, action, runInAction } from "mobx";
import axios from "axios";
import Validator from "validatorjs";
import mainStore from "./MainStore";

class ProductStore {
  @observable productList = null;
  @observable modal = false;
  @observable selectedProduct = null;
  @observable editForm = this.setNewForm();
  @observable productFilter = {};
  @observable showDeleteConfirmation = false;

  @action
  onFieldChange = (field, value) => {
    this.editForm.fields[field].value = value;
    let { name, price, quantity } = this.editForm.fields;
    var validation = new Validator(
      {
        name: name.value,
        price: price.value,
        quantity: quantity.value
      },
      {
        name: name.rule,
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
        name: {
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
  };

  @action
  saveProduct = async () => {
    let product = this.getProductFromEditForm();
    const response = await axios.post("webapi/product/set", product);
    if (response.data.ok) {
      this.loadProductList(this.productFilter);
      if (!this.selectedProduct) {
        mainStore.showSnackBar(`Product Created`);
      } else {
        mainStore.showSnackBar("Product Updated");
      }
      this.toggleModal();
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
