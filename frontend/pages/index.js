import Head from "next/head";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import {
  Flex,
  Link,
  Spacer,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
} from "@chakra-ui/react";

const Home = () => {
  const [randomLink, setRandomLink] = useState("/snippetzone");

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setRandomLink(
      "/" +
        Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substring(0, 7)
    );
    if (localStorage.getItem("modalShown") !== "true") onOpen();
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
      <Modal
        isOpen={isOpen}
        onClose={() => {
          localStorage.setItem("modalShown", "true");
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please read!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              This website loggs essential analytics data such as IP addresses
              and pages data. The data is NOT selled or used for
              indentification. To request the deletion of your data mail me at
              tudor.zgimbau@gmail.com. This pop-up should appear only once per
              browser.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Flex>
        <NextLink href="/about" legacyBehavior passHref>
          <Button color="brand">
            <Text fontSize="20px">
              <Link>about us</Link>
            </Text>
          </Button>
        </NextLink>
        <Spacer />
        <NextLink href="/contact" legacyBehavior passHref>
          <Button color="brand">
            <Text fontSize="20px">
              <Link>contact</Link>
            </Text>
          </Button>
        </NextLink>
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
            // Use this instead of link to prevent caching
            onClick={() => {
              location.href = randomLink;
            }}
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
