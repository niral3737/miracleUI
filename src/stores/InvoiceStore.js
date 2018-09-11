import { observable, action, runInAction } from "mobx";
import axios from "axios";
import debounce from "lodash/debounce";
import Validator from "validatorjs";
import mainStore from "./MainStore";

const PAGE_SIZE = 50;
const INITIAL_PAGING_OFFSET_INVOICE_ID = 0;

class InvoiceStore {
  @observable
  loading = false;
  @observable
  loadingMoreData = false;
  @observable
  invoiceList = [];
  @observable
  modal = false;
  @observable
  selectedInvoice = null;
  @observable
  editForm = this.setNewForm();
  @observable
  invoiceFilter = this.setNewInvoiceFilter();
  @observable
  showDeleteConfirmation = false;
  @observable
  searchString = "";

  @action
  onFieldChange = (field, value) => {
    this.editForm.fields[field].value = value;
    let { title } = this.editForm.fields;
    var validation = new Validator(
      {
        title: title.value
      },
      {
        title: title.rule
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
        title: {
          value: !this.selectedInvoice ? "" : this.selectedInvoice.title,
          error: null,
          rule: "required"
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
  setSelectedInvoice = invoice => {
    this.selectedInvoice = invoice;
    this.resetForm();
  };

  @action
  loadInvoiceList = async () => {
    this.loading = true;
    const response = await axios.post(
      "/webapi/invoice/get",
      this.invoiceFilter
    );
    if (response.data.ok) {
      runInAction(() => {
        this.invoiceList = response.data.payload;
      });
    } else {
      console.log("There is some error");
    }
    this.loading = false;
  };

  @action
  loadNextPage = async () => {
    if (this.invoiceList.length % PAGE_SIZE !== 0) return;

    this.loadingMoreData = true;
    this.invoiceFilter.pagingOffsetInvoiceId = this.invoiceList[
      this.invoiceList.length - 1
    ].id;
    const response = await axios.post(
      "/webapi/invoice/get",
      this.invoiceFilter
    );
    if (response.data.ok) {
      runInAction(() => {
        if (response.data.payload.length !== 0) {
          response.data.payload.forEach(invoice => {
            this.invoiceList.push(invoice);
          });
        }
      });
    } else {
      console.log("There is some error");
    }
    this.loadingMoreData = false;
  };

  @action
  saveInvoice = async addMore => {
    let invoice = this.getInvoiceFromEditForm();
    const response = await axios.post("webapi/invoice/set", invoice);
    if (response.data.ok) {
      this.resetInvoiceFilter();
      this.loadInvoiceList(this.invoiceFilter);
      if (!this.selectedInvoice) {
        mainStore.showSnackBar(`Invoice Created`);
      } else {
        mainStore.showSnackBar("Invoice Updated");
      }

      if (!addMore) {
        this.toggleModal();
      }
      this.selectedInvoice = null;
      this.resetForm();
    } else {
      response.data.payload.forEach(violation => {
        this.editForm.fields[violation.dataFieldName].error =
          violation.errorMessage;
      });
    }
  };

  @action
  removeInvoice = async () => {
    this.toggleDeleteConfirmation();
    if (this.selectedInvoice) {
      const response = await axios.delete(
        `webapi/invoice/remove/${this.selectedInvoice.id}`
      );
      if (response.data.ok) {
        this.resetInvoiceFilter();
        this.loadInvoiceList(this.invoiceFilter);
        mainStore.showSnackBar("Invoice Deleted");
        this.toggleModal();
        this.resetForm();
      } else {
        this.editForm.meta.error = response.data.payload[0].errorMessage;
      }
    }
  };

  getInvoiceFromEditForm = () => {
    return {
      id: !this.selectedInvoice ? 0 : this.selectedInvoice.id,
      title: this.editForm.fields.title.value
    };
  };

  @action
  resetInvoiceFilter = () => {
    this.invoiceFilter = this.setNewInvoiceFilter();
  };

  setNewInvoiceFilter() {
    return {
      pagingOffsetInvoiceId: INITIAL_PAGING_OFFSET_INVOICE_ID,
      limit: PAGE_SIZE
    };
  }

  @action
  onSearch = searchString => {
    this.resetInvoiceFilter();
    this.invoiceFilter.searchString = searchString;
    this.debounceApiCall(this.loadInvoiceList);
  };

  debounceApiCall = debounce(call => call(), 500);

  setSearchString = value => {
    this.invoiceFilter.searchString = value;
  };
}

const invoiceStore = new InvoiceStore();
export default invoiceStore;
