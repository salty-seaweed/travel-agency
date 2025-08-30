import React from 'react';
import {
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  ClockIcon,
  ArrowPathIcon,
  EyeIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';

interface PageVersion {
  id: number;
  version_number: number;
  title: string;
  created_at: string;
  created_by: string;
  changes_summary?: string;
}

interface PageVersionHistoryProps {
  versions: PageVersion[];
  onRevertToVersion: (versionNumber: number) => void;
  onViewVersion: (version: PageVersion) => void;
}

export const PageVersionHistory: React.FC<PageVersionHistoryProps> = ({
  versions,
  onRevertToVersion,
  onViewVersion,
}) => {
  const { isOpen: isRevertModalOpen, onOpen: onRevertModalOpen, onClose: onRevertModalClose } = useDisclosure();
  const [selectedVersion, setSelectedVersion] = React.useState<PageVersion | null>(null);

  const handleRevertClick = (version: PageVersion) => {
    setSelectedVersion(version);
    onRevertModalOpen();
  };

  const handleConfirmRevert = () => {
    if (selectedVersion) {
      onRevertToVersion(selectedVersion.version_number);
      onRevertModalClose();
    }
  };

  if (versions.length === 0) {
    return (
      <Card>
        <CardBody>
          <VStack spacing={4}>
            <ClockIcon className="w-8 h-8 text-gray-400" />
            <Text color="gray.500">No version history available</Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <Card>
        <CardHeader>
          <Heading size="md">Version History</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={3} align="stretch">
            {versions.map((version) => (
              <HStack key={version.id} justify="space-between" p={3} border="1px" borderColor="gray.200" borderRadius="md">
                <VStack align="start" spacing={1}>
                  <HStack spacing={2}>
                    <Badge colorScheme="blue">v{version.version_number}</Badge>
                    <Text fontWeight="medium">{version.title}</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    {new Date(version.created_at).toLocaleString()} by {version.created_by}
                  </Text>
                  {version.changes_summary && (
                    <Text fontSize="xs" color="gray.500">
                      {version.changes_summary}
                    </Text>
                  )}
                </VStack>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<EyeIcon className="w-4 h-4" />}
                    onClick={() => onViewVersion(version)}
                  >
                    View
                  </Button>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<EllipsisVerticalIcon className="w-4 h-4" />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<ArrowPathIcon className="w-4 h-4" />}
                        onClick={() => handleRevertClick(version)}
                      >
                        Revert to this version
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </HStack>
            ))}
          </VStack>
        </CardBody>
      </Card>

      <Modal isOpen={isRevertModalOpen} onClose={onRevertModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Version Revert</ModalHeader>
          <ModalBody>
            <Alert status="warning">
              <AlertIcon />
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">Warning!</Text>
                <Text>
                  Are you sure you want to revert to version {selectedVersion?.version_number}? 
                  This will replace the current content with the version from{' '}
                  {selectedVersion?.created_at ? new Date(selectedVersion.created_at).toLocaleString() : 'unknown date'}.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  This action cannot be undone.
                </Text>
              </VStack>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onRevertModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="orange"
              onClick={handleConfirmRevert}
            >
              Revert to Version {selectedVersion?.version_number}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};


