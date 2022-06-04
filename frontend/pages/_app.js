import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { DarkMode, GlobalStyle } from '@chakra-ui/react'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  useEffect(async () => {
    let page = document.URL.substring(27);
    console.log(page);
    if (page === "")
      page = "index";
    await fetch(process.env.NEXT_PUBLIC_ANALYTICS_SERVER + "/analytics/" + page);
  })
  
  return (
    <ChakraProvider>
      <DarkMode>
        <GlobalStyle />
        <Component {...pageProps} />
      </DarkMode>
    </ChakraProvider>
  );
}

export default MyApp
