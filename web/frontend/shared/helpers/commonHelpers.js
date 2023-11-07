export function getLabelFromValue(condition_options, value) {
    const condition = condition_options.find(option => option.value === value);
    return condition?.label || null;
}
