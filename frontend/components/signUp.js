import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const SignUp = ({ isOpen, onClose, id }) => {
  const [passwordImage, setPasswordImage] = useState("");

  useEffect(() => {
    const fetchPassword = async () => {
      const _res = await fetch(process.env.NEXT_PUBLIC_BACKEND + "/auth/" + id);
      setPasswordImage("data:image/png;base64," + (await _res.text()));
    };

    if (isOpen) fetchPassword();
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc={false}
      closeOnOverlayClick={true}
      isCentered
    >
      <ModalOverlay backdropFilter="auto" backdropBlur="5px" />
      <ModalContent>
        <ModalHeader>Scan and copy the generated password</ModalHeader>
        <ModalBody justifyContent="center">
          <img src={passwordImage} />
        </ModalBody>
        <ModalFooter justifyContent="center">
          <div>WARNING! You will only see this once</div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignUp;
