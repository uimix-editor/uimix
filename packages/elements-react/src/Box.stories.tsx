import { Box } from "./index";

export default {
  title: "Box",
  component: Box,
};

export const Basic = () => {
  return <Box width={100} height={200} fills={[{ solid: "#c0ffee" }]} />;
};
