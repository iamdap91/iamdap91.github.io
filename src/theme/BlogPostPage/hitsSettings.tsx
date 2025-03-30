import "react";
import React from "react";

export default (pageUrl: string) => {
  const last = (pageUrl.split("/") || []).pop();
  return (
    <a href="https://vbr.nathanchung.dev">
      <img
        src={`https://vbr.nathanchung.dev/badge?page_id=iamdap91-${last}&color=green&style=for-the-badge`}
        alt=""
      />
    </a>
  );
};
