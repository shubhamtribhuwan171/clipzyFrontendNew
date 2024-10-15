// // import React from 'react';
// // import { Box, VStack, Button, HStack, useColorModeValue } from '@chakra-ui/react';
// // import { 
// //   EditIcon, 
// //   MoonIcon, 
// //   PhoneIcon, 
// //   ViewIcon 
// // } from '@chakra-ui/icons';

// // const sidebarItems = [
// //    { name: 'Music', icon: MoonIcon },
// //   { name: 'Voice', icon: PhoneIcon },
// //   { name: 'Overlay', icon: ViewIcon },
// // ];

// // function Sidebar({ onItemClick, selectedItem }) {
// //   const bg = useColorModeValue("gray.100", "gray.700");
// //   const iconColor = useColorModeValue("gray.600", "gray.200");

// //   return (
// //     <Box bg={bg} height="100%" p={2}>
// //       <VStack spacing={2} align="stretch">
// //         {sidebarItems.map((item) => (
// //           <Button
// //             key={item.name}
// //             onClick={() => onItemClick(item.name)}
// //             colorScheme={item.name === selectedItem ? "blue" : "gray"}
// //             color={item.name === selectedItem ? undefined : iconColor}
// //             size="sm"
// //             variant={item.name === selectedItem ? "solid" : "ghost"}
// //             justifyContent="flex-start"
// //             leftIcon={<item.icon />}
// //           >
// //             {item.name}
// //           </Button>
// //         ))}
// //       </VStack>
// //     </Box>
// //   );
// // }

// // export default Sidebar;

// import React, { useState } from 'react';
// import { Menu, Moon, Phone, Eye } from 'lucide-react';

// const sidebarItems = [
//   { name: 'Music', icon: Moon },
//   { name: 'Voice', icon: Phone },
//   { name: 'Overlay', icon: Eye },
// ];

// const Sidebar = ({ onItemClick, selectedItem }) => {
//   const [isOpen, setIsOpen] = useState(true);

//   return (
//     <div className={`bg-gray-100 dark:bg-gray-800 h-full transition-all duration-300 ${isOpen ? 'w-80' : 'w-16'}`}>
//       <div className="p-4">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="mb-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//         >
//           <Menu size={24} className="text-gray-600 dark:text-gray-300" />
//         </button>
//         <div className="space-y-2">
//           {sidebarItems.map((item) => (
//             <button
//               key={item.name}
//               onClick={() => onItemClick(item.name)}
//               className={`w-full flex items-center p-2 rounded-lg transition-colors duration-200
//                 ${item.name === selectedItem
//                   ? 'bg-blue-500 text-white'
//                   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
//                 }`}
//             >
//               <item.icon size={20} className="mr-3" />
//               {isOpen && <span>{item.name}</span>}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// import React, { useState } from 'react';
// import { Menu, Moon, Phone, Eye } from 'lucide-react';

// const sidebarItems = [
//   { name: 'Music', icon: Moon },
//   { name: 'Voice', icon: Phone },
//   { name: 'Overlay', icon: Eye },
// ];

// const Sidebar = ({ onItemClick, selectedItem }) => {
//   const [isOpen, setIsOpen] = useState(true);

//   return (
//     <div className={`bg-gray-100 dark:bg-gray-800 h-full transition-all duration-300 ${isOpen ? 'w-80' : 'w-16'}`}>
//       <div className="p-4 flex flex-col h-full">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="mb-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 self-start"
//         >
//           {/* <Menu size={24} className="text-gray-600 dark:text-gray-300" /> */}
//         </button>
//         <div style={{display:'table-caption'}}>
//           {sidebarItems.map((item) => (
//             <button
//               key={item.name}
//               onClick={() => onItemClick(item.name)}
//               className={`flex items-center p-2 rounded-lg transition-colors duration-200
//                 ${item.name === selectedItem
//                   ? 'bg-blue-500 text-white'
//                   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
//                 }`}
//             >
//               <item.icon size={20} className={isOpen ? "mr-3" : "mx-auto"} />
//               {isOpen && <span>{item.name}</span>}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React from 'react';
import { Box, IconButton, Tooltip, VStack, useColorModeValue } from '@chakra-ui/react';
import { MdMic, MdMusicNote, MdTextFields, MdFilter } from 'react-icons/md';

const Sidebar = ({ onItemClick, activePanel }) => {
  const iconSize = 6; // Equivalent to 24px

const sidebarItems = [
  { name: 'Music', icon: MdMusicNote },
  { name: 'Voice', icon: MdTextFields },
  { name: 'Overlay', icon: MdFilter },
];

  // Color mode values
  const bgGradient = useColorModeValue(
    'linear(to-b, gray.100, gray.200)',
    'linear(to-b, gray.800, gray.900)'
  );
  const borderColor = useColorModeValue('gray.300', 'gray.700');
  const hoverBg = useColorModeValue('gray.200', 'whiteAlpha.200');
  const activeBg = useColorModeValue('gray.300', 'whiteAlpha.300');
  const activeColor = useColorModeValue('blue.500', 'cyan.400');
  const boxShadow = useColorModeValue(
    '0 0 10px rgba(0, 0, 0, 0.05)',
    '0 0 10px rgba(0, 0, 0, 0.1)'
  );

  return (
    <Box
      width="70px"
      bgGradient={bgGradient}
      display="flex"
      flexDirection="column"
      alignItems="center"
      py={4}
      borderRight="1px solid"
      borderColor={borderColor}
      height="100%"
      boxShadow={boxShadow}
    >
      <VStack spacing={6}>
        {sidebarItems.map((item) => (
          <Tooltip key={item.name} label={item.name} placement="right">
            <IconButton
              icon={<item.icon size={iconSize * 4} />}
              aria-label={item.name}
              variant="ghost"
              size="lg"
              isActive={activePanel === item.name}
              onClick={() => onItemClick(item.name)}
              _hover={{
                bg: hoverBg,
                transform: 'scale(1.1)',
              }}
              _active={{
                bg: activeBg,
                transform: 'scale(0.98)',
              }}
              sx={{
                '&[aria-pressed=true]': {
                  bg: activeBg,
                  color: activeColor,
                  boxShadow: `0 0 15px ${activeColor}`,
                },
              }}
              transition="all 0.2s"
            />
          </Tooltip>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar; 