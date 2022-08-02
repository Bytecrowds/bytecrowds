import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";
import theme from "../theme";

function MyApp({ Component, pageProps }) {
  // Send the IP adress and current page to the analytics server.
  useEffect(() => {
    async function fetchAnalytics() {
      let page;
      let environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
      if (environment === "development")
        // http://localhost:xxxx/abc => abc .
        page = document.URL.substring(22);
      else if (environment === "production")
        // https://www.bytecrowds.com/abc => abc .
        page = document.URL.substring(27);
      if (page === "") page = "index";
      await fetch(process.env.NEXT_PUBLIC_BACKEND + "/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page: page }),
      });
    }
    fetchAnalytics();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
