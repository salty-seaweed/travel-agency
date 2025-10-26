import React from 'react';
import {
	Box,
	VStack,
	HStack,
	Text,
	IconButton,
	Tooltip,
	Divider,
	useColorModeValue,
	Flex,
	Spacer,
	Badge,
} from '@chakra-ui/react';
import {
	EyeIcon,
	EyeSlashIcon,
	LockClosedIcon,
	LockOpenIcon,
	TrashIcon,
	DocumentDuplicateIcon,
	ChevronUpIcon,
	ChevronDownIcon,
	DocumentTextIcon,
	PhotoIcon,
	VideoCameraIcon,
	ChartBarIcon,
	TableCellsIcon,
	CalendarIcon,
	MapPinIcon,
	EnvelopeIcon,
	UserGroupIcon,
	ShoppingCartIcon,
} from '@heroicons/react/24/outline';

interface DroppedItem {
	id: string;
	type: string;
	name: string;
	description: string;
	icon: any;
	content: string;
	props: Record<string, any>;
	position: { x: number; y: number };
	size: { width: number; height: number };
	zIndex: number;
	locked: boolean;
	visible: boolean;
	customStyles?: Record<string, any>;
	data?: Record<string, any>;
}

interface LayerPanelProps {
	content: DroppedItem[];
	selectedItems: string[];
	onSelectionChange: (selectedItems: string[]) => void;
	onItemUpdate: (itemId: string, updates: Partial<DroppedItem>) => void;
	onItemLock: (itemId: string) => void;
	onItemVisibility: (itemId: string) => void;
	onItemDelete: (itemId: string) => void;
	onItemDuplicate: (itemId: string) => void;
	onItemMove: (itemId: string, direction: 'up' | 'down') => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
	content,
	selectedItems,
	onSelectionChange,
	onItemUpdate,
	onItemLock,
	onItemVisibility,
	onItemDelete,
	onItemDuplicate,
	onItemMove,
}) => {
	const bgColor = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.700');
	const textColor = useColorModeValue('gray.800', 'white');
	const hoverBgColor = useColorModeValue('gray.50', 'gray.700');

	const typeToIcon: Record<string, React.ComponentType<any>> = {
		text: DocumentTextIcon,
		image: PhotoIcon,
		video: VideoCameraIcon,
		chart: ChartBarIcon,
		table: TableCellsIcon,
		calendar: CalendarIcon,
		map: MapPinIcon,
		form: EnvelopeIcon,
		social: UserGroupIcon,
		ecommerce: ShoppingCartIcon,
	};

	const resolveIconComponent = (item: DroppedItem): React.ComponentType<any> => {
		if (typeof item.icon === 'function') {
			return item.icon as React.ComponentType<any>;
		}
		const mapped = typeToIcon[item.type];
		return mapped || DocumentTextIcon;
	};

	const handleItemClick = (itemId: string, event: React.MouseEvent) => {
		if (event.ctrlKey || event.metaKey) {
			// Multi-select
			if (selectedItems.includes(itemId)) {
				onSelectionChange(selectedItems.filter(id => id !== itemId));
			} else {
				onSelectionChange([...selectedItems, itemId]);
			}
		} else {
			// Single select
			onSelectionChange([itemId]);
		}
	};

	const handleItemDoubleClick = (itemId: string) => {
		// Focus on the item in the canvas
		onSelectionChange([itemId]);
	};

	const sortedContent = [...content].sort((a, b) => b.zIndex - a.zIndex);

	return (
		<Box p={4} bg={bgColor} height="100%" overflowY="auto">
			<VStack spacing={4} align="stretch">
				<HStack justify="space-between">
					<Text fontWeight="semibold" color={textColor}>
						Layers
					</Text>
					<Badge colorScheme="blue" variant="subtle">
						{content.length}
					</Badge>
				</HStack>

				<Divider />

				{sortedContent.length === 0 ? (
					<Box textAlign="center" py={8}>
						<Text color="gray.500" fontSize="sm">
							No items to display
						</Text>
						<Text color="gray.400" fontSize="xs">
							Add components to see them here
						</Text>
					</Box>
				) : (
					<VStack spacing={1} align="stretch">
						{sortedContent.map((item, index) => {
							const isSelected = selectedItems.includes(item.id);
							const isFirst = index === 0;
							const isLast = index === sortedContent.length - 1;
							const IconComp = resolveIconComponent(item);

							return (
								<Box
									key={item.id}
									p={2}
									bg={isSelected ? 'blue.50' : 'transparent'}
									border="1px solid"
									borderColor={isSelected ? 'blue.200' : 'transparent'}
									borderRadius="md"
									cursor="pointer"
									_hover={{ bg: isSelected ? 'blue.50' : hoverBgColor }}
									onClick={(e) => handleItemClick(item.id, e)}
									onDoubleClick={() => handleItemDoubleClick(item.id)}
									transition="all 0.2s"
								>
									<HStack spacing={2} align="center">
										{/* Visibility Toggle */}
										<Tooltip label={item.visible ? 'Hide' : 'Show'}>
											<IconButton
												size="xs"
												variant="ghost"
												icon={item.visible ? <EyeIcon className="w-3 h-3" /> : <EyeSlashIcon className="w-3 h-3" />}
												onClick={(e) => {
													e.stopPropagation();
													onItemVisibility(item.id);
												}}
												aria-label={item.visible ? 'Hide' : 'Show'}
												color={item.visible ? 'gray.600' : 'gray.400'}
											/>
										</Tooltip>

										{/* Lock Toggle */}
										<Tooltip label={item.locked ? 'Unlock' : 'Lock'}>
											<IconButton
												size="xs"
												variant="ghost"
												icon={item.locked ? <LockClosedIcon className="w-3 h-3" /> : <LockOpenIcon className="w-3 h-3" />}
												onClick={(e) => {
													e.stopPropagation();
													onItemLock(item.id);
												}}
												aria-label={item.locked ? 'Unlock' : 'Lock'}
												color={item.locked ? 'orange.500' : 'gray.400'}
											/>
										</Tooltip>

										{/* Item Icon */}
										<Box
											w={4}
											h={4}
											display="flex"
											alignItems="center"
											justifyContent="center"
											color="gray.500"
										>
											<IconComp className="w-4 h-4" />
										</Box>

										{/* Item Name */}
										<Text
											fontSize="sm"
											fontWeight={isSelected ? 'semibold' : 'normal'}
											color={textColor}
											flex={1}
											noOfLines={1}
										>
											{item.name}
										</Text>

										{/* Item Type Badge */}
										<Badge size="sm" variant="subtle" colorScheme="gray">
											{item.type}
										</Badge>

										<Spacer />

										{/* Layer Controls */}
										<HStack spacing={1}>
											{/* Move Up */}
											<Tooltip label="Move Up">
												<IconButton
													size="xs"
													variant="ghost"
													icon={<ChevronUpIcon className="w-3 h-3" />}
													onClick={(e) => {
														e.stopPropagation();
														onItemMove(item.id, 'up');
													}}
													isDisabled={isFirst}
													aria-label="Move Up"
												/>
											</Tooltip>

											{/* Move Down */}
											<Tooltip label="Move Down">
												<IconButton
													size="xs"
													variant="ghost"
													icon={<ChevronDownIcon className="w-3 h-3" />}
													onClick={(e) => {
														e.stopPropagation();
														onItemMove(item.id, 'down');
													}}
													isDisabled={isLast}
													aria-label="Move Down"
												/>
											</Tooltip>

											{/* Duplicate */}
											<Tooltip label="Duplicate">
												<IconButton
													size="xs"
													variant="ghost"
													icon={<DocumentDuplicateIcon className="w-3 h-3" />}
													onClick={(e) => {
														e.stopPropagation();
														onItemDuplicate(item.id);
													}}
													aria-label="Duplicate"
												/>
											</Tooltip>

											{/* Delete */}
											<Tooltip label="Delete">
												<IconButton
													size="xs"
													variant="ghost"
													icon={<TrashIcon className="w-3 h-3" />}
													onClick={(e) => {
														e.stopPropagation();
														onItemDelete(item.id);
													}}
													aria-label="Delete"
													color="red.500"
													_hover={{ bg: 'red.50' }}
												/>
											</Tooltip>
										</HStack>
									</HStack>

									{/* Additional Info */}
									<HStack spacing={2} mt={1} pl={8}>
										<Text fontSize="xs" color="gray.500">
											{item.position.x}, {item.position.y}
										</Text>
										<Text fontSize="xs" color="gray.500">
											{item.size.width} × {item.size.height}
										</Text>
										<Text fontSize="xs" color="gray.500">
											z: {item.zIndex}
										</Text>
									</HStack>
								</Box>
							);
						})}
					</VStack>
				)}

				{/* Selection Info */}
				{selectedItems.length > 0 && (
					<>
						<Divider />
						<Box p={2} bg="blue.50" borderRadius="md">
							<Text fontSize="sm" color="blue.700" fontWeight="medium">
								{selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
							</Text>
							{selectedItems.length > 1 && (
								<Text fontSize="xs" color="blue.600" mt={1}>
									Use Ctrl/Cmd + Click to select multiple items
								</Text>
							)}
						</Box>
					</>
				)}
			</VStack>
		</Box>
	);
};
