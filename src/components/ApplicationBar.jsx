import React from "react";
import { AppBar } from "material-ui";
import AppBarIconMenu from "./AppBarIconMenu";

const appBarStyle = {
  top: 0,
  bottom: "auto",
  right: 0,
  left: 0,
  position: "fixed"
};

const ApplicationBar = ({ currentTabTitle }) => {
  const rightButtons = (
    <div>
      <AppBarIconMenu />
    </div>
  );
  return (
    <AppBar
      title={currentTabTitle}
      style={appBarStyle}
      showMenuIconButton={false}
      iconElementRight={rightButtons}
    />
  );
};

export default ApplicationBar;
