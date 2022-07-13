import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  //useEffect(() => {
  //  async function fetchAnalytics() {
  //    let page = document.URL.substring(27);
  //    if (page === "") page = "index";
  //    await fetch(
  //      process.env.NEXT_PUBLIC_ANALYTICS_SERVER + "/analytics/" + page
  //    );
  //  }
  //  fetchAnalytics();
  //}, []);

  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
