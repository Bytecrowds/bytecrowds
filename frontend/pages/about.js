import { Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

const About = () => {
  return (
    <>
      <Text marginTop="30px" fontSize="6xl" color="brand">
        What is Bytecrowds?
      </Text>
      <Text fontSize="30px">
        Bytecrowds.com is a quick & reliable tool that allows you to share code
        in real-time with your peers, offering a simple interface and code
        editor that supports multiple languages.
      </Text>
      <Text marginTop="120px" fontSize="6xl" color="brand">
        Who&apos;s in charge of the project?
      </Text>
      <Text fontSize="30px">
        Currently the site is operated solely by me, Tudor Zgimbau. Find more in
        the{" "}
        <NextLink href="/contact" legacyBehavior passHref>
          <Link color="brand">contact</Link>
        </NextLink>{" "}
        section{" "}
      </Text>
      <Text marginTop="120px" fontSize="6xl" color="brand">
        Is this a commercial project?
      </Text>
      <Text fontSize="30px">
        No, at least for now. This is a hobby project of mine that I will try to
        keep as updated as possible and maybe monetize through ads.
      </Text>
    </>
  );
};

export default About;
