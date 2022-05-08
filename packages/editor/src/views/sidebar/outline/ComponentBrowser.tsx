import { colors } from "@seanchas116/paintkit/src/components/Palette";
import styled from "styled-components";

const ComponentBrowserWrap = styled.div`
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.disabledText};
  font-size: 12px;
`;

export const ComponentBrowser: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ ...props }) => {
  return <ComponentBrowserWrap {...props}>TODO</ComponentBrowserWrap>;
};
