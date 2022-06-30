import React from "react";

type Props = {
  name: string;
};

export default function Dialog(props: Props) {
  return <div>{props.name}</div>;
}
