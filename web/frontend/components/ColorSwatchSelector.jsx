import "../components/stylesheets/colorSwatchStyle.css";

const ColorSwatchSelector = ({ label, onClick, backgroundColor, ariaExpanded, ariaControls }) => {
  const buttonStyle = {
    backgroundColor,
  };

  return (
    <button
      className='custom-button-style'
      style={buttonStyle}
      onClick={onClick}
      aria-label={label}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    >
      {label}
    </button>
  );
};

export default ColorSwatchSelector;
