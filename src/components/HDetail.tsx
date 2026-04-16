interface HDetailProps {
  color?: string;
  text?: string;
  children?: React.ReactNode;
}

export default function HDetail(props: HDetailProps) {
  return (
    <details
      style={{
        border: "1px solid orange",
        padding: "8px",
        borderRadius: "10px",
        backgroundColor: "rgba(255, 165, 0, 0.15)",
      }}
    >
      <summary
        style={{
          cursor: "pointer",
          color: props.color || "#333",
          fontWeight: 400,
        }}
      >
        {props.text ?? "点我展开/折叠"}
      </summary>
      <div
        style={{
          margin: "20px 0px",
          borderTop: "1px solid orange",
          paddingTop: "20px",
          maxHeight: "600px",
          overflowX: "auto",
        }}
      >
        {props.children}
      </div>
    </details>
  );
}
