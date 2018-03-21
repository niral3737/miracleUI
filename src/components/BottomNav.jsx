import React, { Component } from "react";
import { Paper, BottomNavigation, BottomNavigationItem } from "material-ui";
import AccountBalanceWallet from "material-ui/svg-icons/action/account-balance-wallet";
import Person from "material-ui/svg-icons/social/person";
import ShoppingCart from "material-ui/svg-icons/action/shopping-cart";
import { withRouter } from "react-router-dom";

const style = {
  margin: 0,
  top: "auto",
  bottom: 0,
  right: 0,
  left: 0,
  position: "fixed"
};

class BottomNav extends Component {
  select = index => {
    const { history, setTabSelection } = this.props;
    setTabSelection(index);
    switch (index) {
      case 0:
        history.push("/");
        break;
      case 1:
        history.push("/customers");
        break;
      case 2:
        history.push("/products");
        break;
      default:
        history.push("/");
    }
  };
  render() {
    const { selectedTabIndex } = this.props;
    return (
      <Paper zDepth={5} style={style}>
        <BottomNavigation selectedIndex={selectedTabIndex}>
          <BottomNavigationItem
            label="Billing"
            icon={<AccountBalanceWallet />}
            onClick={() => this.select(0)}
          />
          <BottomNavigationItem
            label="Customers"
            icon={<Person />}
            onClick={() => this.select(1)}
          />
          <BottomNavigationItem
            label="Products"
            icon={<ShoppingCart />}
            onClick={() => this.select(2)}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}

export default withRouter(BottomNav);
