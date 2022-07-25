import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";
import { getBytecrowd } from "../utils/db";

const Auth = ({ id, isOpen, onClose }) => {
  const passwordRef = useRef(null);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay backdropFilter="auto" backdropBlur="5px" />
      <ModalContent>
        <ModalHeader>Please log in to acces this bytecrowd</ModalHeader>
        <ModalBody justifyContent="center" alignContent="center">
          <Input
            ref={passwordRef}
            placeholder="password"
            _placeholder={{ opacity: 2, color: "brand" }}
          ></Input>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            onClick={async () => {
              const bytecrowd = await getBytecrowd(id, {
                authMethod: "password",
                password: passwordRef.current.value,
              });

              if (!bytecrowd.authFailed) onClose();
            }}
            color="brand"
            variant="outline"
          >
            log in
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Auth;
