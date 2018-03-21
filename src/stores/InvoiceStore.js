import { observable, action, runInAction } from "mobx";
import axios from "axios";

class InvoiceStore {
  @observable invoiceList = null;
  @observable modal = false;
  @observable selectedInvoice = null;

  @action
  toggleModal = () => {
    this.modal = !this.modal;
  };

  @action
  closeModal = () => {
    this.modal = false;
  };

  @action
  setSelectedInvoice = customer => {
    this.selectedInvoice = customer;
  };

  @action
  addInvoice = invoice => {
    this.invoiceList.push(invoice);
  };

  @action
  loadInvoiceList = async invoiceFilter => {
    const response = await axios.post("/webapi/invoice/get", invoiceFilter);
    runInAction(() => {
      this.invoiceList = response.data;
    });
  };
}

const invoiceStore = new InvoiceStore();
export default invoiceStore;
