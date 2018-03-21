import React from "react";
import { IconMenu, IconButton, MenuItem } from "material-ui";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import { white } from "material-ui/styles/colors";

const iconMenuStyle = {
  marginRight: "1rem"
};

const AppBarIconMenu = () => (
  <IconMenu
    style={iconMenuStyle}
    iconButtonElement={
      <IconButton>
        <MoreVertIcon color={white} />
      </IconButton>
    }
    targetOrigin={{ horizontal: "right", vertical: "top" }}
    anchorOrigin={{ horizontal: "right", vertical: "top" }}
  >
    <MenuItem primaryText="Help" />
    <MenuItem primaryText="Sign out" />
  </IconMenu>
);

export default AppBarIconMenu;
