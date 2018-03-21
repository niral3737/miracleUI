import { observable, action } from "mobx";

class MainStore {
  @observable snackBarOpen = false;
  @observable snackBarMessage = "";

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
