import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Snackbar from "material-ui/Snackbar";
import InvoiceMain from "./invoice/InvoiceMain";
import BottomNav from "./BottomNav";
import ApplicationBar from "./ApplicationBar";
import CustomerMain from "./customer/CustomerMain";
import { withRouter } from "react-router-dom";
import NoMatch from "./NoMatch";
import ProductMain from "./product/ProductMain";
import { inject, observer } from "mobx-react";

@withRouter
@inject("mainStore")
@observer
class Main extends Component {
  state = {
    currentTabTitle: "Invoices",
    selectedTabIndex: 0
  };
  constructor(props) {
    super(props);
    this.setTabTitle = this.setTabTitle.bind(this);
    this.setTabSelection = this.setTabSelection.bind(this);
  }
  setTabTitle(title) {
    this.setState({ currentTabTitle: title });
  }

  setTabSelection(index) {
    this.setState({ selectedTabIndex: index });
  }
  componentDidMount() {
    this.onRouteChanged(this.props.location.pathname);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged(this.props.location.pathname);
    }
  }

  onRouteChanged(currentRoute) {
    switch (currentRoute) {
      case "/":
        this.setTabTitle("Invoices");
        this.setTabSelection(0);
        break;
      case "/customers":
        this.setTabTitle("Customers");
        this.setTabSelection(1);
        break;
      case "/products":
        this.setTabTitle("Products");
        this.setTabSelection(2);
        break;
      default:
        this.setTabTitle("");
        break;
    }
  }
  render() {
    const {
      snackBarOpen,
      snackBarMessage,
      hideSnackBar
    } = this.props.mainStore;
    return (
      <div>
        <ApplicationBar currentTabTitle={this.state.currentTabTitle} />
        <Switch>
          <Route exact path="/" component={InvoiceMain} />
          <Route path="/customers" component={CustomerMain} />
          <Route path="/products" component={ProductMain} />
          <Route component={NoMatch} />
        </Switch>
        <BottomNav
          setTabSelection={this.setTabSelection}
          selectedTabIndex={this.state.selectedTabIndex}
        />
        <Snackbar
          open={snackBarOpen}
          message={snackBarMessage}
          autoHideDuration={4000}
          onRequestClose={hideSnackBar}
          style={{
            right: 0,
            left: "auto"
          }}
        />
      </div>
    );
  }
}

export default Main;
