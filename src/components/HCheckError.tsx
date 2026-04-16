import { checkErrorData } from "@site/src/datas/check_error";

interface HCheckErrorProps {
  text: string;
}

export default function HCheckError(props: HCheckErrorProps) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: checkErrorData(props.text) }}
      style={{ textAlign: "left", maxWidth: "530px" }}
    />
  );
}
