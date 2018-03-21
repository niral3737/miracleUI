import React from "react";
import CircularProgress from "material-ui/CircularProgress";

import { mainCircularProgressStyle } from "../styles";

const MainProgress = () => {
  return (
    <CircularProgress
      size={80}
      thickness={5}
      style={mainCircularProgressStyle}
    />
  );
};

export default MainProgress;
