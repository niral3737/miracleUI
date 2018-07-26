import { observable, action, runInAction } from "mobx";
import axios from "axios";
import debounce from "lodash/debounce";
import Validator from "validatorjs";
import mainStore from "./MainStore";

const PAGE_SIZE = 50;
const INITIAL_PAGING_OFFSET_CUSTOMER_ID = 0;

class CustomerStore {
  @observable loading = false;
  @observable loadingMoreData = false;
  @observable customerList = [];
  @observable modal = false;
  @observable selectedCustomer = null;
  @observable editForm = this.setNewForm();
  @observable customerFilter = this.setNewCustomerFilter();
  @observable showDeleteConfirmation = false;
  @observable searchString = "";

  @action
  onFieldChange = (field, value) => {
    console.log(field, value);
    this.editForm.fields[field].value = value;
    let { name, address, phoneNumber } = this.editForm.fields;
    var validation = new Validator(
      {
        name: name.value,
        address: address.value,
        phoneNumber: phoneNumber.value
      },
      {
        name: name.rule,
        address: address.rule,
        phoneNumber: phoneNumber.rule
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
          value: !this.selectedCustomer ? "" : this.selectedCustomer.name,
          error: null,
          rule: "required"
        },
        phoneNumber: {
          value: !this.selectedCustomer
            ? ""
            : this.selectedCustomer.phoneNumber,
          error: null,
          rule: "required|numeric"
        },
        address: {
          value: !this.selectedCustomer ? "" : this.selectedCustomer.address,
          error: null,
          rule: ["regex:/^*"]
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
  setSelectedCustomer = customer => {
    this.selectedCustomer = customer;
    this.resetForm();
  };

  @action
  loadCustomerList = async () => {
    this.loading = true;
    const response = await axios.post(
      "/webapi/customer/get",
      this.customerFilter
    );
    if (response.data.ok) {
      runInAction(() => {
        this.customerList = response.data.payload;
      });
    } else {
      console.log("There is some error");
    }
    this.loading = false;
  };

  @action
  loadNextPage = async () => {
    if (this.customerList.length % PAGE_SIZE !== 0) return;

    this.loadingMoreData = true;
    this.customerFilter.pagingOffsetCustomerId = this.customerList[
      this.customerList.length - 1
    ].id;
    const response = await axios.post(
      "/webapi/customer/get",
      this.customerFilter
    );
    if (response.data.ok) {
      runInAction(() => {
        if (response.data.payload.length !== 0) {
          response.data.payload.forEach(customer => {
            this.customerList.push(customer);
          });
        }
      });
    } else {
      console.log("There is some error");
    }
    this.loadingMoreData = false;
  };

  @action
  saveCustomer = async addMore => {
    let customer = this.getCustomerFromEditForm();
    const response = await axios.post("webapi/customer/set", customer);
    if (response.data.ok) {
      this.resetCustomerFilter();
      this.loadCustomerList(this.customerFilter);
      if (!this.selectedCustomer) {
        mainStore.showSnackBar(`Customer Created`);
      } else {
        mainStore.showSnackBar("Customer Updated");
      }

      if (!addMore) {
        this.toggleModal();
      }
      this.selectedCustomer = null;
      this.resetForm();
    } else {
      response.data.payload.forEach(violation => {
        this.editForm.fields[violation.dataFieldName].error =
          violation.errorMessage;
      });
    }
  };

  @action
  removeCustomer = async () => {
    this.toggleDeleteConfirmation();
    if (this.selectedCustomer) {
      const response = await axios.delete(
        `webapi/customer/remove/${this.selectedCustomer.id}`
      );
      if (response.data.ok) {
        this.resetCustomerFilter();
        this.loadCustomerList(this.customerFilter);
        mainStore.showSnackBar("Customer Deleted");
        this.toggleModal();
        this.resetForm();
      } else {
        this.editForm.meta.error = response.data.payload[0].errorMessage;
      }
    }
  };

  getCustomerFromEditForm = () => {
    return {
      id: !this.selectedCustomer ? 0 : this.selectedCustomer.id,
      name: this.editForm.fields.name.value,
      address: this.editForm.fields.address.value,
      phoneNumber: this.editForm.fields.phoneNumber.value
    };
  };

  @action
  resetCustomerFilter = () => {
    this.customerFilter = this.setNewCustomerFilter();
  };

  setNewCustomerFilter() {
    return {
      pagingOffsetCustomerId: INITIAL_PAGING_OFFSET_CUSTOMER_ID,
      limit: PAGE_SIZE
    };
  }

  @action
  onSearch = searchString => {
    this.resetCustomerFilter();
    this.customerFilter.searchString = searchString;
    this.debounceApiCall(this.loadCustomerList);
  };

  debounceApiCall = debounce(call => call(), 500);

  setSearchString = value => {
    this.customerFilter.searchString = value;
  };
}

const customerStore = new CustomerStore();
export default customerStore;
