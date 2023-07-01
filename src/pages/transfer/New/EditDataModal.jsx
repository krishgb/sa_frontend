import { AddIcon, EditIcon } from '@chakra-ui/icons'
import { Button, Code, Flex, FormControl, FormErrorMessage, FormLabel, Input, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect } from 'react'
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

export default function AddDataModal({action, data}) {
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

        const new_data = {
            ...data,
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
        
        const parsed = form_schema.safeParse(new_data)
        if(parsed.success){
            set_errors(n_err)
            action(new_data)
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

    const form_ref = useRef(null)
    const undo = () => {
        name_ref.current.value = data.name
        roll_no_ref.current.value = data.roll_no
        sem_ref.current.value = data.sem
        branch_ref.current.value = data.branch
        from_id_ref.current.value = data.from_id
        from_ref.current.value = data.from
        to_id_ref.current.value = data.to_id
        to_ref.current.value = data.to
        attendance_ref.current.value = data.attendance
        sanction_ref.current.value = data.sanction
        admitted_ref.current.value = data.admitted
        vacancy_ref.current.value = data.vacancy
    }


    const edit = () => {
        onOpen()
        // name_ref.current.value = data.name
        // roll_no_ref.current.value = data.roll_no
        // sem_ref.current.value = data.sem
        // branch_ref.current.value = data.branch
        // from_id_ref.current.value = data.from_id
        // from_ref.current.value = data.from
        // to_id_ref.current.value = data.to_id
        // to_ref.current.value = data.to
        // attendance_ref.current.value = data.attendance
        // sanction_ref.current.value = data.sanction
        // admitted_ref.current.value = data.admitted
        // vacancy_ref.current.value = data.vacancy
    }

    return (
        <>
            <MenuItem 
                onClick={edit} 
                color='white' 
                display={'flex'} 
                gap={2} 
                backgroundColor={'gray.700'} 
                _hover={{backgroundColor: 'black'}}
            >
                <EditIcon
                    __css={{
                        g: {
                            stroke: 'white'
                        }
                    }}
                />
                Edit
            </MenuItem>

            <Modal isOpen={isOpen} onClose={onClose} size={'4xl'}>
                <ModalOverlay />
                <ModalContent
                    backgroundColor={'gray.700'}
                >
                    <ModalHeader color='white'>Add new student data 
                        <Code ml={2} borderRadius={'5px'} px={2} color='white' backgroundColor={'#e2e8f029'}>
                            <span style={{color: 'orange'}}>*</span> - Required Field
                        </Code>
                    </ModalHeader>
                    <ModalCloseButton backgroundColor={'white'} />
                    <form onSubmit={submit} ref={form_ref}>

                        <ModalBody>
                            <Flex gap={4} mb={2}>
                                <FormControl isRequired isInvalid={errors.name.trim().length}>
                                    <FormLabel color={'white'}>Name</FormLabel>
                                    <Input border='1px solid #cccccc30' ref={name_ref} color='white' type='text' defaultValue={data?.name || '' } />
                                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.roll_no.trim().length}>
                                    <FormLabel color={'white'}>Roll no</FormLabel>
                                    <Input border='1px solid #cccccc30' ref={roll_no_ref} color='white' type='text' defaultValue={data?.roll_no || '' } />
                                    <FormErrorMessage>{errors.roll_no}</FormErrorMessage>
                                </FormControl>
                            </Flex>

                            <Flex gap={4} mb={2}>
                                <FormControl isRequired isInvalid={errors.sem.trim().length}>
                                    <FormLabel color={'white'}>Sem</FormLabel>
                                    <Input border='1px solid #cccccc30' list='sems' ref={sem_ref} color='white' type='text' defaultValue={data?.sem || '' } />
                                    <datalist id='sems'>
                                        <option value='I' />
                                        <option value='II' />
                                        <option value='III' />
                                        <option value='IV' />
                                        <option value='V' />
                                        <option value='VI' />
                                        <option value='VII' />
                                        <option value='VIII' />
                                        <option value='IX' />
                                        <option value='X' />
                                    </datalist>
                                    <FormErrorMessage>{errors.sem}</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.branch.trim().length}>
                                    <FormLabel color={'white'}>Branch</FormLabel>
                                    <Input border='1px solid #cccccc30' list='branches' ref={branch_ref} color='white' type='text' defaultValue={data?.branch || '' } />
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
                                    <Input border='1px solid #cccccc30' ref={from_id_ref} color='white' type='text' defaultValue={data?.from_id || '' } />
                                    <FormErrorMessage>{errors.from_id}</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.from.trim().length}>
                                    <FormLabel color={'white'}>From College</FormLabel>
                                    <Input border='1px solid #cccccc30' ref={from_ref} color='white' type='text' defaultValue={data?.from || '' } />
                                    <FormErrorMessage>{errors.from}</FormErrorMessage>
                                </FormControl>
                            </Flex>

                            <Flex gap={4} mb={2}>
                                <FormControl isRequired isInvalid={errors.to_id.trim().length}>
                                    <FormLabel color={'white'}>To College Dote ID</FormLabel>
                                    <Input border='1px solid #cccccc30' ref={to_id_ref} color='white' type='text' defaultValue={data?.to_id || '' } />
                                    <FormErrorMessage>{errors.to_id}</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.to.trim().length}>
                                    <FormLabel color={'white'}>To College</FormLabel>
                                    <Input border='1px solid #cccccc30' ref={to_ref} color='white' type='text' defaultValue={data?.to || '' } />
                                    <FormErrorMessage>{errors.to}</FormErrorMessage>
                                </FormControl>
                            </Flex>

                            <Flex gap={4} mb={2}>
                                <FormControl isRequired isInvalid={errors.attendance.trim().length}>
                                    <FormLabel color={'white'}>Attendance</FormLabel>
                                    <Input border='1px solid #cccccc30' ref={attendance_ref} color='white' type='number' defaultValue={data?.attendance || '' } />
                                    <FormErrorMessage>{errors.attendance}</FormErrorMessage>
                                </FormControl>
                                
                                <FormControl isRequired isInvalid={errors.sanction.trim().length}>
                                    <FormLabel color={'white'}>Sanction</FormLabel>
                                    <Input border='1px solid #cccccc30' ref={sanction_ref} color='white' type='number' defaultValue={data?.sanction || '' } />
                                    <FormErrorMessage>{errors.sanction}</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.admitted.trim().length}>
                                    <FormLabel color={'white'}>Admitted</FormLabel>
                                    <Input border='1px solid #cccccc30' ref={admitted_ref} color='white' type='number' defaultValue={data?.admitted || '' } />
                                    <FormErrorMessage>{errors.admitted}</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.vacancy.trim().length}>
                                    <FormLabel color={'white'}>Vacancy</FormLabel>
                                    <Input border='1px solid #cccccc30' ref={vacancy_ref} color='white' type='number' defaultValue={data?.vacancy || '' } />
                                    <FormErrorMessage>{errors.vacancy}</FormErrorMessage>
                                </FormControl>
                            </Flex>
                        </ModalBody>

                        <ModalFooter display={'flex'} gap={4}>
                            <Button variant='ghost' onClick={undo} type='reset' color='#d6bcfa' _hover={{backgroundColor: '#d6bcfa1f'}}>Undo</Button>
                            <Button 
                                variant='outline' 
                                onClick={onClose} 
                                type='button'
                                color='red.200' 
                                backgroundColor={'transparent'} 
                                _hover={{backgroundColor: '#feb2b21f'}}
                            >Cancel</Button>
                            <Button 
                                type='submit' 
                                variant={'outline'} 
                                color='green.200' 
                                backgroundColor={'transparent'} 
                                _hover={{backgroundColor: '#9ae6b41f'}}
                                mr={3}
                            >Submit</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}
