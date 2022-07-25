import Head from "next/head";
import NextLink from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { Spacer } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

const Home = () => {
  const [randomLink, setRandomLink] = useState("/snippetzone");
  // Set this to true when the hydration finished.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setRandomLink(
      "/" +
        Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substring(0, 7)
    );
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Bytecrowds - Landing</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>
      <Flex>
        <Button color="brand">
          <NextLink href="/about" passHref>
            <Text fontSize="20px">
              <Link>about us</Link>
            </Text>
          </NextLink>
        </Button>
        <Spacer />
        <Button color="brand">
          <NextLink href="/contact" passHref>
            <Text fontSize="20px">
              <Link>contact</Link>
            </Text>
          </NextLink>
        </Button>
      </Flex>
      <Flex
        flexDirection="column"
        marginTop={{
          "2xl": "130px",
          xl: "70px",
          lg: "70px",
          md: "70px",
          base: "10px",
        }}
        marginLeft={{
          "2xl": "200px",
          lg: "120px",
          md: "80px",
          base: "5px",
        }}
      >
        <div>
          <Flex
            flexDirection={{
              base: "column",
              xl: "row",
              lg: "row",
              md: "row",
            }}
          >
            <Text fontSize="65px" fontWeight="600">
              Welcome to
            </Text>
            <Text
              marginLeft={{
                xl: "14px",
                lg: "14px",
                md: "14px",
              }}
              fontSize="65px"
              fontWeight="600"
              color="brand"
            >
              Bytecrowds
            </Text>
          </Flex>
          <Text marginTop="20px" fontWeight="600" fontSize="35px">
            &quot;the easy & quick way to share code with friends and teams.
            currently in beta&quot;
          </Text>
          <Button
            color="brand"
            marginTop="75px"
            width={{
              xl: "450px",
              lg: "450px",
              md: "450px",
            }}
            height="90px"
            fontSize="30px"
            fontWeight="600"
            onClick={() =>
              // We don't have acces to window.location on the server.
              isMounted ? (location.href = randomLink) : undefined
            }
          >
            new bytecrowd
          </Button>
        </div>
        <Flex
          flexDirection="row"
          width="400px"
          marginTop={{
            xl: "180px",
            lg: "180px",
            md: "180px",
            base: "50px",
          }}
          justifyItems="center"
        >
          <Text fontSize="14px" marginRight="10px">
            developed in
          </Text>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 3 2"
          >
            <path fill="#002B7F" d="M0 0h3v2H0z" />
            <path fill="#FCD116" d="M1 0h2v2H1z" />
            <path fill="#CE1126" d="M2 0h1v2H2z" />
          </svg>
          <Text marginLeft="10px" fontSize="14px">
            by{" "}
            <Link
              href="https://www.linkedin.com/in/tudor-zg%C3%AEmb%C4%83u-a85274234/"
              color="brand"
              isExternal
            >
              Tudor Zgîmbău
            </Link>
          </Text>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
