import React from "react";

interface RowProps {
  children?: React.ReactNode;
}

export default function Row({ children }: RowProps) {
  return (
    <div
      style={{
        margin: "20px 0",
        paddingTop: "20px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
      }}
    >
      {children}
    </div>
  );
}
