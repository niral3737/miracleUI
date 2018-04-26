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
  componentDidMount() {
    this.onRouteChanged(this.props.location.pathname);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged(this.props.location.pathname);
    }
  }

  onRouteChanged(currentRoute) {
    const { selectTab } = this.props.mainStore;
    switch (currentRoute) {
      case "/":
        selectTab(0);
        break;
      case "/customers":
        selectTab(1);
        break;
      case "/products":
        selectTab(2);
        break;
      default:
        selectTab(0);
        break;
    }
  }
  render() {
    const {
      snackBarOpen,
      snackBarMessage,
      hideSnackBar,
      currentTabTitle,
      selectedTabIndex,
      selectTab
    } = this.props.mainStore;
    return (
      <div>
        <ApplicationBar currentTabTitle={currentTabTitle} />
        <Switch>
          <Route exact path="/" component={InvoiceMain} />
          <Route path="/customers" component={CustomerMain} />
          <Route path="/products" component={ProductMain} />
          <Route component={NoMatch} />
        </Switch>
        <BottomNav
          setTabSelection={selectTab}
          selectedTabIndex={selectedTabIndex}
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
