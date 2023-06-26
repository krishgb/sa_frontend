import React, { ReactNode } from 'react';
import {
    Box,
    CloseButton,
    Flex,
    useColorModeValue,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    DrawerOverlay,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Input,
    DrawerFooter,
    Button,
    Image,
    Heading,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom';


const LinkItems = [
    { name: 'Home' },
    { name: 'Trending' },
    { name: 'Explore' },
    { name: 'Favourites' },
    { name: 'Settings' },
];

export default function SimpleSidebar({ children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Image
                color={'green'}
                src='/images/sidebar.svg'
                alt='Toggle'
                w='28px'
                // backgroundColor='whiteAlpha.700'
                p={1}
                borderRadius={'lg'}
                cursor={'pointer'}
                onMouseOver={onOpen}
                backdropFilter={'blur(10px)'}
                border={'1px solid #aaa'}
            />

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                size={'xs'}
            >
                <DrawerOverlay />
                <DrawerContent 
                    backgroundColor={'white'} 
                    onMouseLeave={onClose}
                >
                    <DrawerCloseButton />
                    <DrawerHeader fontSize={'1.1rem'}>Student Affairs</DrawerHeader>

                    <DrawerBody display={'flex'} gap={4} flexDirection={'column'}>
                        <Text fontSize={'15px'}>Services</Text>
                        <Box ml={4} gap={5} display={'grid'} fontSize={'14px'}>
                            <Link to='/'><Text fontWeight={'600'}><span style={{fontSize: '1.2rem'}}>🚀</span> &nbsp;&nbsp;&nbsp; Transfer</Text></Link>
                            <Link to='/'><Text fontWeight={'600'}><span style={{fontSize: '1.2rem'}}>🎓</span> &nbsp;&nbsp;&nbsp; Readmission</Text></Link>
                            <Link to='/'><Text fontWeight={'600'}><span style={{fontSize: '1.2rem'}}>🎓</span> &nbsp;&nbsp;&nbsp; R cum T </Text></Link>
                            <Link to='/'><Text fontWeight={'600'}><span style={{fontSize: '1.2rem'}}>📝</span> &nbsp;&nbsp;&nbsp; RRA</Text></Link>
                            <Link to='/'><Text fontWeight={'600'}><span style={{fontSize: '1.2rem'}}>😤</span> &nbsp;&nbsp;&nbsp; Break of Study</Text></Link>
                            <Link to='/'><Text fontWeight={'600'}><span style={{fontSize: '1.2rem'}}>🚼</span> &nbsp;&nbsp;&nbsp; Name Change</Text></Link>
                            <Link to='/'><Text fontWeight={'600'}><span style={{fontSize: '1.2rem'}}>🥲</span> &nbsp;&nbsp;&nbsp; Grievance</Text></Link>
                        </Box>

                    

                    </DrawerBody>

                    <DrawerFooter>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}

