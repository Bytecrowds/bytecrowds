import { Text } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";

const Contact = () => {
  return (
    <>
      <Text
        marginTop={{
          sm: "260px",
          lg: "350px",
        }}
        fontSize="30px"
      >
        For any inquiry or feedback contact me at{" "}
        <Link
          isExternal
          href="mailto:tudor.zgimbau@gmail.com"
          color="orange.200"
        >
          {" "}
          tudor.zgimbau@gmail.com{" "}
        </Link>
        or message me on{" "}
        <Link
          isExternal
          href="https://www.linkedin.com/in/tudor-zg%C3%AEmb%C4%83u-a85274234/"
          color="orange.200"
        >
          Linkedin
        </Link>
      </Text>
    </>
  );
};

export default Contact;
