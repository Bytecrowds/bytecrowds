import { Text } from "@chakra-ui/react";

const StyledText = ({ children, styling }) => {
  return (
    <Text
      background="brand"
      backgroundClip="text"
      fill="transparent"
      style={styling}
    >
      {children}
    </Text>
  );
};

export default StyledText;
