import { AddIcon } from '@chakra-ui/icons'
import { Button, Code, Flex, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import {z} from 'zod'

const form_schema = z.object({
    name: z.string().min(3),
    roll_no: z.string().min(3),
    sem: z.enum(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']),
    branch: z.string().min(3),
    from_id: z.string().min(1),
    from: z.string().min(10),
    to_id: z.string().min(1),
    to: z.string().min(10),
    attendance: z.number().max(100).min(1),
    sanction: z.number().min(1),
    admitted: z.number().min(1),
    vacancy: z.number().min(1),
})

export default function AddDataModal({add_one}) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [errors, set_errors] = useState({
        name: '',
        roll_no: '',
        sem: '',
        branch: '',
        from_id: '',
        from: '',
        to_id: '',
        to: '',
        attendance: '',
        sanction: '',
        admitted: '',
        vacancy: ''
    })

    const name_ref = useRef(null)
    const roll_no_ref = useRef(null)
    const sem_ref = useRef(null)
    const branch_ref = useRef(null)
    const from_id_ref = useRef(null)
    const from_ref = useRef(null)
    const to_id_ref = useRef(null)
    const to_ref = useRef(null)
    const attendance_ref = useRef(null)
    const sanction_ref = useRef(null)
    const admitted_ref = useRef(null)
    const vacancy_ref = useRef(null)
    
    const submit = e => {
        e.preventDefault()

        const data = {
            name: name_ref.current.value,
            roll_no: roll_no_ref.current.value,
            sem: sem_ref.current.value,
            branch: branch_ref.current.value,
            from_id: from_id_ref.current.value,
            from: from_ref.current.value,
            to_id: to_id_ref.current.value,
            to: to_ref.current.value,
            attendance: parseInt(attendance_ref.current.value),
            sanction: parseInt(sanction_ref.current.value),
            admitted: parseInt(admitted_ref.current.value),
            vacancy: parseInt(vacancy_ref.current.value),
        }

        
        const n_err = {}
        for(let i of Object.keys(errors)) n_err[i] = ''
        
        const parsed = form_schema.safeParse(data)
        if(parsed.success){
            set_errors(n_err)
            add_one(data)            
            onClose()
            return
        }
        
        for(let error of parsed.error.errors){
            const path = error.path[0]
            const message = error.message
            n_err[path] = message
        }
        set_errors(n_err)
    }

    return (
        <>
            <Button
                display={'flex'}
                gap={2}
                colorScheme='twitter'
                backgroundColor={'twitter.200'}
                color='gray.800'
                onClick={onOpen}
                _hover={{backgroundColor: 'twitter.300'}}
            >
                <AddIcon />
                Add new data
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size={'4xl'}>
                <ModalOverlay />
                <ModalContent
                    backgroundColor={'gray.700'}
                >
                    <ModalHeader color='white'>Add new student data 
                        <Code ml={2} borderRadius={'5px'} px={2} color={'white'} backgroundColor={'#e2e8f029'}>
                            <span style={{color: 'orange'}}>*</span> - Required Field
                        </Code>
                    </ModalHeader>
                    <ModalCloseButton backgroundColor={'white'} />
                    <form onSubmit={submit}>

                        <ModalBody>
                            <Flex gap={4} mb={2}>
                                <FormControl isRequired isInvalid={errors.name.trim().length}>
                                    <FormLabel color={'white'}>Name</FormLabel>
                                    <Input ref={name_ref} color='white' type='text' border='1px solid #cccccc30' />
                                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.roll_no.trim().length}>
                                    <FormLabel color={'white'}>Roll no</FormLabel>
                                    <Input ref={roll_no_ref} color='white' type='text' border='1px solid #cccccc30'/>
                                    <FormErrorMessage>{errors.roll_no}</FormErrorMessage>
                                </FormControl>
                            </Flex>

                            <Flex gap={4} mb={2}>
                                <FormControl isRequired isInvalid={errors.sem.trim().length}>
                                    <FormLabel color={'white'}>Sem</FormLabel>
                                    <Input list='sems' ref={sem_ref} color='white' type='text' border='1px solid #cccccc30'/>
                                    <datalist id='sems'>
                                        <option value='I'>I</option>
                                        <option value='II'>II</option>
                                        <option value='III'>III</option>
                                        <option value='IV'>IV</option>
                                        <option value='V'>V</option>
                                        <option value='VI'>VI</option>
                                        <option value='VII'>VII</option>
                                        <option value='VIII'>VIII</option>
                                        <option value='VIII'>IX</option>
                                        <option value='VIII'>X</option>
                                    </datalist>
                                    <FormErrorMessage>{errors.sem}</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.branch.trim().length}>
                                    <FormLabel color={'white'}>Branch</FormLabel>
                                    <Input list='branches' ref={branch_ref} color='white' type='text' border='1px solid #cccccc30'/>
                                    <datalist id='branches' >
                                        <option value={'CIVIL'} >CIVIL</option>
                                        <option value={'MECHANICAL'}>MECHANICAL</option>
                                    </datalist>
                                    <FormErrorMessage>{errors.branch}</FormErrorMessage>
                                </FormControl>
                            </Flex>

                            <Flex gap={4} mb={2}>
                                <FormControl isRequired isInvalid={errors.from_id.trim().length}>
                                    <FormLabel color={'white'}>From College Dote ID</FormLabel>
                                    <Input ref={from_id_ref} color='white' type='text' border='1px solid #cccccc30'/>
                                    <FormErrorMessage>{errors.from_id}</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.from.trim().length}>
                                    <FormLabel color={'white'}>From College</FormLabel>
                                    <Input ref={from_ref} color='white' type='text' border='1px solid #cccccc30' />
                                    <FormErrorMessage>{errors.from}</FormErrorMessage>
                                </FormControl>
                            </Flex>

                            <Flex gap={4} mb={2}>
                                <FormControl isRequired isInvalid={errors.to_id.trim().length}>
                                    <FormLabel color={'white'}>To College Dote ID</FormLabel>
                                    <Input ref={to_id_ref} color='white' type='text' border='1px solid #cccccc30'/>
                                    <FormErrorMessage>{errors.to_id}</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.to.trim().length}>
                                    <FormLabel color={'white'}>To College</FormLabel>
                                    <Input ref={to_ref} color='white' type='text' border='1px solid #cccccc30'/>
                                    <FormErrorMessage>{errors.to}</FormErrorMessage>
                                </FormControl>
                            </Flex>

                            <Flex gap={4} mb={2}>
                                <FormControl isRequired isInvalid={errors.attendance.trim().length}>
                                    <FormLabel color={'white'}>Attendance</FormLabel>
                                    <Input ref={attendance_ref} color='white' type='number' border='1px solid #cccccc30'/>
                                    <FormErrorMessage>{errors.attendance}</FormErrorMessage>
                                </FormControl>
                                
                                <FormControl isRequired isInvalid={errors.sanction.trim().length}>
                                    <FormLabel color={'white'}>Sanction</FormLabel>
                                    <Input ref={sanction_ref} color='white' type='number' border='1px solid #cccccc30'/>
                                    <FormErrorMessage>{errors.sanction}</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.admitted.trim().length}>
                                    <FormLabel color={'white'}>Admitted</FormLabel>
                                    <Input ref={admitted_ref} color='white' type='number' border='1px solid #cccccc30'/>
                                    <FormErrorMessage>{errors.admitted}</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.vacancy.trim().length}>
                                    <FormLabel color={'white'}>Vacancy</FormLabel>
                                    <Input ref={vacancy_ref} color='white' type='number' border='1px solid #cccccc30'/>
                                    <FormErrorMessage>{errors.vacancy}</FormErrorMessage>
                                </FormControl>
                            </Flex>
                        </ModalBody>

                        <ModalFooter display={'flex'} gap={4}>
                            <Button variant='ghost' type='reset' color='#d6bcfa' _hover={{backgroundColor: '#d6bcfa1f'}}>Reset</Button>
                            <Button 
                                type='submit' 
                                colorScheme='blue' 
                                mr={3}
                                backgroundColor={'blue.200'}
                                _hover={{backgroundColor: 'blue.300'}}
                            >
                                Add
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}
