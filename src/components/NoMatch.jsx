import React from "react";
import { Link } from "react-router-dom";

const NoMatch = () => {
  return (
    <div>
      <h4>Error - 404</h4>
      <p>Requested resource not found</p>
      <Link to="/">Home</Link>
    </div>
  );
};

export default NoMatch;
