import { ColorPicker, Collapsible } from '@shopify/polaris';

export default function CollapsibleColorPicker({ open, id, color, onChange }) {

  return (
    <Collapsible
      open={open}
      id={id}
    >
      <br />
      <ColorPicker onChange={onChange} color={color} allowAlpha />
    </Collapsible>
  );
}
