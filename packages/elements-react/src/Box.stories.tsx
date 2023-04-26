import { Box, Text } from "./index";

export default {
  title: "Box",
  component: Box,
};

export const Basic = () => {
  return <Box width={100} height={200} fills={[{ solid: "#c0ffee" }]} />;
};

export const WithText = () => {
  return (
    <Box
      width={100}
      height={200}
      fills={[{ solid: "#c0ffee" }]}
      layout="flex"
      flexDirection="y"
    >
      <Text fills={[{ solid: "#000" }]} textContent="Hello, world!" />
      <Text fills={[{ solid: "#666" }]} textContent="This is a text" />
    </Box>
  );
};
