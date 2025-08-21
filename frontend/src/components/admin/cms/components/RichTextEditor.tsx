import React, { useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  useColorModeValue,
  Divider,
  Tooltip,
  IconButton,
  Select,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import {
  ChatBubbleLeftIcon as QuoteIcon,
  LinkIcon,
  PhotoIcon,
  ArrowUturnLeftIcon as UndoIcon,
  ArrowUturnRightIcon as RedoIcon,
} from '@heroicons/react/24/outline';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing your content...',
}) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertHTML = (html: string) => {
    document.execCommand('insertHTML', false, html);
    editorRef.current?.focus();
  };

  const handleLink = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setLinkText(selection.toString());
      setIsLinkModalOpen(true);
    }
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const linkHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      insertHTML(linkHTML);
    }
    setIsLinkModalOpen(false);
    setLinkUrl('');
    setLinkText('');
  };

  const insertImage = () => {
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl) {
      const imageHTML = `<img src="${imageUrl}" alt="" style="max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0;" />`;
      insertHTML(imageHTML);
    }
  };

  const toolbarButtons = [
    {
      text: 'B',
      command: 'bold',
      tooltip: 'Bold',
      fontWeight: 'bold',
    },
    {
      text: 'I',
      command: 'italic',
      tooltip: 'Italic',
      fontStyle: 'italic',
    },
    {
      text: 'U',
      command: 'underline',
      tooltip: 'Underline',
      textDecoration: 'underline',
    },
    { divider: true },
    {
      text: 'UL',
      command: 'insertUnorderedList',
      tooltip: 'Bullet List',
    },
    {
      icon: QuoteIcon,
      command: 'formatBlock',
      value: '<blockquote>',
      tooltip: 'Quote',
    },
    { divider: true },
    {
      icon: LinkIcon,
      onClick: handleLink,
      tooltip: 'Insert Link',
    },
    {
      icon: PhotoIcon,
      onClick: insertImage,
      tooltip: 'Insert Image',
    },
  ];

  return (
    <Box>
      {/* Toolbar */}
      <Box
        border="1px solid"
        borderColor={borderColor}
        borderBottom="none"
        borderTopRadius="md"
        bg={bgColor}
        p={2}
      >
        <HStack spacing={1} wrap="wrap">
          {toolbarButtons.map((button, index) => {
            if (button.divider) {
              return <Divider key={index} orientation="vertical" h={6} />;
            }

            return (
              <Tooltip key={index} label={button.tooltip}>
                {button.icon ? (
                  <IconButton
                    size="sm"
                    variant="ghost"
                    icon={<button.icon className="w-4 h-4" />}
                    onClick={() => {
                      if (button.onClick) {
                        button.onClick();
                      } else if (button.command) {
                        execCommand(button.command, button.value);
                      }
                    }}
                    aria-label={button.tooltip}
                  />
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    minW="32px"
                    h="32px"
                    fontWeight={button.fontWeight}
                    fontStyle={button.fontStyle}
                    textDecoration={button.textDecoration}
                    onClick={() => {
                      if (button.onClick) {
                        button.onClick();
                      } else if (button.command) {
                        execCommand(button.command, button.value);
                      }
                    }}
                    aria-label={button.tooltip}
                  >
                    {button.text}
                  </Button>
                )}
              </Tooltip>
            );
          })}
        </HStack>
      </Box>

      {/* Editor */}
      <Box
        ref={editorRef}
        contentEditable
        border="1px solid"
        borderColor={borderColor}
        borderTopRadius="none"
        borderBottomRadius="md"
        bg={bgColor}
        color={textColor}
        p={4}
        minH="300px"
        maxH="600px"
        overflowY="auto"
        _focus={{
          outline: 'none',
          borderColor: 'blue.500',
          boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => {
          const content = e.currentTarget.innerHTML;
          onChange(content);
        }}
        sx={{
          '& h1': {
            fontSize: '2xl',
            fontWeight: 'bold',
            mb: 4,
            mt: 6,
          },
          '& h2': {
            fontSize: 'xl',
            fontWeight: 'semibold',
            mb: 3,
            mt: 5,
          },
          '& h3': {
            fontSize: 'lg',
            fontWeight: 'semibold',
            mb: 2,
            mt: 4,
          },
          '& p': {
            mb: 4,
            lineHeight: 'tall',
          },
          '& ul, & ol': {
            mb: 4,
            pl: 6,
          },
          '& li': {
            mb: 1,
          },
          '& blockquote': {
            borderLeft: '4px solid',
            borderColor: 'blue.500',
            pl: 4,
            py: 2,
            bg: 'blue.50',
            borderRadius: 'md',
            mb: 4,
            fontStyle: 'italic',
          },
          '& pre': {
            bg: 'gray.100',
            p: 3,
            borderRadius: 'md',
            fontFamily: 'mono',
            fontSize: 'sm',
            overflowX: 'auto',
            mb: 4,
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 'md',
            mb: 4,
          },
        }}
      />

      {/* Link Modal */}
      <Modal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Insert Link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Link Text</FormLabel>
                <Input
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Link text"
                />
              </FormControl>
              <FormControl>
                <FormLabel>URL</FormLabel>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsLinkModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={insertLink}>
              Insert Link
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
