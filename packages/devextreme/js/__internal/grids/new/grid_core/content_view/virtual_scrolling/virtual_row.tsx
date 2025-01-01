export interface Props {
  height: number;
}

export function VirtualRow(props: Props): JSX.Element {
  return (
    <div style={{ height: `${props.height}px` }}/>
  );
}
