import type { HorizontalAlignment } from '@js/ui/data_grid';

interface Props {
  alignment: HorizontalAlignment;
}

export function Cell(props: Props): JSX.Element {
  return (
    <td
      style={{
        'text-align': props.alignment,
      }}
    />
  );
}
