import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const textGradientStyles = {
  WebkitBackgroundClip: "text !important",
  MozBackroundClip: "text !important",
  WebkitTextFillColor: "transparent !important",
  MozTextFillColor: "transparent !important",
};

const theme = extendTheme({
  components: {
    Link: {
      baseStyle: textGradientStyles,
    },
  },
  config,
  colors: {
    brand:
      "linear-gradient(90deg, rgba(64,215,133,1) 0%, rgba(26,208,221,1) 100%)",
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode(
          // light mode value retrieved from theme
          props.theme.semanticTokens.colors["chakra-body-bg"]._light,
          // your custom value for dark mode
          "#121417"
        )(props),
      },
    }),
  },
});

export default theme;
