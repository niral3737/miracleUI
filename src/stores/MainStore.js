import { observable, action, computed } from "mobx";

export class MainStore {
  @observable snackBarOpen = false;
  @observable snackBarMessage = "";
  @observable selectedTabIndex = 0;

  @computed
  get currentTabTitle() {
    switch (this.selectedTabIndex) {
      case 0:
        return "Invoices";
      case 1:
        return "Customers";
      case 2:
        return "Products";
      default:
        return "";
    }
  }
  @action
  selectTab = index => {
    this.selectedTabIndex = index;
  };

  @action
  showSnackBar = message => {
    this.snackBarOpen = true;
    this.snackBarMessage = message;
  };
  @action
  hideSnackBar = () => {
    this.snackBarOpen = false;
    this.snackBarMessage = "";
  };
}

const mainStore = new MainStore();
export default mainStore;
