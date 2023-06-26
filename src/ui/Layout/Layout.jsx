import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Alert, AlertIcon, Flex, Stack } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useState } from "react";


export default function Layout({children}) {
    const [alert, set_alert] = useState({
        show: false,
        message: '',
    })

    const close_alert = () => {
        set_alert({...alert, show: false})
    }

    return (
        <>
            <Header />
            {
                alert.show && (
                    <Alert 
                        size={'sm'} 
                        status='error' 
                        backgroundColor={'#ff000080'}
                        fontSize={'14px'}
                        display={'flex'}
                        justifyContent={'space-between'}
                        zIndex={1}
                    >
                        <Flex>
                            <AlertIcon />
                            {alert.message || 'There was an error processing your request'}
                        </Flex>
                        <CloseIcon onClick={close_alert} cursor={'pointer'} />
                    </Alert>
                )
            }
            
            
            <main>
                {children}
            </main>
            <Footer />
        </>
    )


}

