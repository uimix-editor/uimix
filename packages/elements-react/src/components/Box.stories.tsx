import { Box, Text } from "./Box";

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
      rowGap={20}
      paddingLeft={10}
      paddingRight={10}
    >
      <Box width={100} height={100} fills={[{ solid: "#f0f0f0" }]} />
      <Text fills={[{ solid: "#000" }]} textContent="Hello, world!" />
      <Text fills={[{ solid: "#666" }]} textContent="This is a text" />
    </Box>
  );
};
