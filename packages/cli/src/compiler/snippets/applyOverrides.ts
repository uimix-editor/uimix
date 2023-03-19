/* eslint-disable */
function applyOverrides(props: any, element: React.ReactElement) {
  const refID = (element.props.refID ?? []) as string[];

  let additionalProps: any = props;
  for (const id of refID) {
    additionalProps = additionalProps.overrides?.[id] ?? {};
  }

  return React.cloneElement(element, {
    ...additionalProps,
    refID: undefined,
    overrides: undefined,
  });
}
