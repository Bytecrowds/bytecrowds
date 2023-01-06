import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@chakra-ui/react";
import { signIn, signOut } from "next-auth/react";

const AuthorizationError = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* credits: https://gist.github.com/dmurawsky/d45f068097d181c733a53687edce1919 */}
      <style global jsx>{`
        html,
        body,
        div#__next,
        div#__next > div {
          height: 100%;
        }
      `}</style>
      <Card>
        <CardHeader color="brand" fontSize="4xl" alignSelf="center">
          Authorization failed
        </CardHeader>
        <CardBody fontSize="2xl">
          Please login with an authorized account to access this bytecrowd
        </CardBody>
        <CardFooter>
          <Button variant="ghost" flex="1" color="brand" onClick={signOut}>
            sign out
          </Button>
          <Button variant="ghost" flex="1" color="brand" onClick={signIn}>
            sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthorizationError;
