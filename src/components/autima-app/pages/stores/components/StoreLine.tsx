import React from "react";
import "./storelist.scss";

function StoreLine(props) {
  const store = props.store;
  return (
    <div className="list-store-container">
      <div>{store.storeId}</div>
      <div>{store.storeLocation}</div>
      <div>{store.ldSales ? store.ldSales : "n/a"}</div>
      <div>{store.wtdSales ? store.wtdSales : "n/a"}</div>
      <div>{store.mtdSales ? store.mtdSales : "n/a"}</div>
      <div>{store.ytdSales ? store.ytdSales : "n/a"}</div>
    </div>
  );
}

export default StoreLine;
