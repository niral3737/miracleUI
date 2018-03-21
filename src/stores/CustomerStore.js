import { observable, action, runInAction } from "mobx";
import axios from "axios";

class CustomerStore {
  @observable customerList = null;
  @observable modal = false;
  @observable selectedCustomer = null;

  @action
  toggleModal = () => {
    this.modal = !this.modal;
  };

  @action
  closeModal = () => {
    this.modal = false;
  };

  @action
  setSelectedCustomer = customer => {
    this.selectedCustomer = customer;
  };

  @action
  loadCustomerList = async customerFilter => {
    const response = await axios.post("/webapi/customer/get", customerFilter);
    runInAction(() => {
      this.customerList = response.data;
    });
  };

  @action
  addCustomer = customer => {
    this.customerList.push(customer);
  };
}

const customerStore = new CustomerStore();
export default customerStore;
