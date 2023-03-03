import tw from "tailwind-styled-components";

export const InspectorPane: React.FC<
  JSX.IntrinsicElements["section"]
> = tw.section`p-3 flex flex-col gap-3 border-b border-macaron-uiBackground`;
