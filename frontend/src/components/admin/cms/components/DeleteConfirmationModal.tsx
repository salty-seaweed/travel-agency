import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from '@chakra-ui/react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemCount: number;
  itemType: string;
  isLoading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemCount,
  itemType,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <Alert status="warning">
            <AlertIcon />
            <Box>
              <AlertTitle>Warning!</AlertTitle>
              <AlertDescription>
                {message}
              </AlertDescription>
            </Box>
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Delete {itemCount} {itemType}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
