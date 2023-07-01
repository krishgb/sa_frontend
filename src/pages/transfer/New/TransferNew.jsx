import React, { Suspense, lazy, useCallback, useEffect, useReducer } from 'react'
import Loading from '@/ui/Loading/Loading'
import { Badge, Button, Flex, Grid, Image, Input, Menu, MenuButton, MenuItem, MenuList, Modal, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react'
import { AttachmentIcon, ChevronDownIcon, DeleteIcon, DragHandleIcon, EditIcon, SpinnerIcon } from '@chakra-ui/icons'
import { useState, useRef } from 'react'
const AddDataModal = lazy(() => import('./AddDataModal'))
const EditDataModal = lazy(() => import('./EditDataModal'))
// import AddDataModal from './AddDataModal'
import remove_runes from '@/lib/remove_runes'

// LINE 74, 118

const PageHead = lazy(() => import('@/ui/PageHead/PageHead'))

const file_types = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
const reducer = (state, action) => {
    switch (action.type) {
        case 'add': {
            const data = action.payload
            const new_data = state.all_data.concat(data)
            return {
                all_data: new_data,
                visible: new_data.slice(0, 100)
            }
        }
        case 'add_one': {
            const data = action.payload
            const all_data = [data, ...state.all_data]
            const visible = [data, ...state.visible]
            return {
                all_data,
                visible
            }
        }
        case 'more': {
            const len = state.visible.length
            if (len === state.all_data.length) return state
            const more = state.all_data.slice(len, len + 100)
            return {
                ...state,
                visible: state.visible.concat(more)
            }
        }
        case 'clear': {
            return {
                all_data: [],
                visible: []
            }
        }
        case 'remove': {
            const id = action.payload
            const all_data = state.all_data.filter((v) => v.id !== id)
            const visible = state.visible.filter((v) => v.id !== id)
            return {
                all_data,
                visible
            }
        }
        case 'edit': {
            let idx = 0
            for(let i = 0; i < state.all_data.length; i++) {
                if(state.all_data[i].id === action.payload.id) {
                    idx = i
                    break
                }
            }
            state.all_data[idx] = action.payload
            state.visible[idx] = action.payload
            return {
                all_data: state.all_data,
                visible: state.visible
            }

        }
        default: {
            return state
        }
    }

}

export default function TransferNew() {
    const [state, dispatch] = useReducer(reducer, { all_data: [], visible: [] })
    const [modal_is_open, set_modal_is_open] = useState(false)
    const [file, set_file] = useState(null)
    const [file_loading, set_file_loading] = useState(false)
    const toast = useToast()

    const observe = useRef(null)
    const refElement = useCallback(node => {
        if (observe.current) observe.current.disconnect()
        observe.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                dispatch({ type: 'more' })
            }
        })
        if (node) observe.current.observe(node)
    }, [state.visible])

    const colleges = new Map()
    const get_colleges = () => {

    }

    const get_data_from_xl = async () => {
        set_file_loading(true)
        const keys = ['sno', 'cat', 'roll_no', 'name', 'sem', 'branch', 'from', 'to', 'sanction', 'admitted', 'vacancy', 'attendance']
        const { readExcel } = await import('@/lib/danfo.esm.js')
        const { $data } = await readExcel(file)
        const rows = []

        for (let i = 0; i < $data.length; i++) {
            const row = $data[i]
            const d = {}
            for (let k = 0; k < keys.length; k++) {
                if (keys[k] === 'from' || keys[k] === 'to') {
                    d[`${keys[k]}_id`] = row[k].slice(0, 4)
                    d[`${keys[k]}`] = remove_runes(row[k].slice(5))
                } else {
                    d[keys[k]] = typeof (row[k]) === 'string' ? remove_runes(row[k]) : row[k]
                }
            }
            d.id = i
            rows.push(d)
        }
        dispatch({ type: 'add', payload: rows })
        set_file_loading(false)
        return rows
    }


    const add_one = (payload) => {
        dispatch({ type: 'add_one', payload })
    }

    const edit = (data) => {
        dispatch({type: 'edit', payload: data})
    }

    const remove = (id) => {
        dispatch({ type: 'remove', payload: id })
    }

    const upload_ref = useRef(null)
    useEffect(() => {
        if (!file) return
        get_data_from_xl()
        upload_ref.current.value = ''
    }, [file])

    useEffect(() => {
        get_colleges()
    }, [])

    const save = async () => {

    }

    return (
        <>
            <Suspense fallback={<Loading />}>
                <PageHead
                    pages={[
                        { title: 'Transfer', link: '/t' },
                        { title: 'New', link: '/t/new' },
                    ]}
                />
            </Suspense>

            <Grid
                mx={6}
                mt={2}
                gap={4}
            >
                <Text
                    fontSize={'1.1rem'}
                    fontWeight={'semibold'}
                >
                    Transfer - Upload
                </Text>

                <Flex gap={4} fontSize={'14px'} alignItems={'center'}>
                    <Suspense fallback={<Spinner />}>
                        <AddDataModal add_one={add_one} />
                    </Suspense>

                    <Button
                        display={'flex'}
                        gap={2}
                        colorScheme='green'
                        backgroundColor={'green.200'}
                        color='gray.800'
                        _hover={{ backgroundColor: 'green.300' }}
                        onClick={() => { upload_ref?.current?.click() }}
                    >
                        <AttachmentIcon />
                        Upload a file
                        <Input
                            onChange={(e) => { set_file(e.target.files[0]) }}
                            // oncli
                            display={'none'}
                            ref={upload_ref}
                            type='file'
                            accept={file_types.join(',')}
                        />
                    </Button>

                    {
                        !state.all_data.length ? <></> :
                            <Button colorScheme='red'
                                onClick={() => { dispatch({ type: 'clear' }) }}
                            >
                                Reset
                            </Button>
                    }

                    <Button
                        display={'flex'}
                        gap={2}
                        bgColor={'#0069ffad'}
                        ml='auto'
                        color='white'
                        _hover={{ backgroundColor: '#0069ff' }}
                        onClick={save}
                    >
                        Save
                    </Button>
                </Flex>

                {
                    file_loading ? <Spinner />
                        :
                        <Text fontSize={'13px'} color={'#666'}>
                            Showing <Badge
                                color='twitter.200'
                                backgroundColor={'#081b4b'}
                            >{state.all_data.length}
                            </Badge> entries
                        </Text>
                }

                <TableContainer
                    height={'60vh'}
                    overflowY={'scroll'}
                    overflowX={'scroll'}
                    borderRadius={'md'}
                    border='1px solid #ccc'
                    className='scroll-bar'
                    resize={'both'}
                >
                    <Table
                        size={'sm'}
                        position={'relative'}
                        style={{ borderCollapse: 'collapse' }}
                        variant={'unstyled'}
                    >
                        <Thead>
                            <Tr>
                                <Th
                                    position={'sticky'}
                                    top={0}
                                    backgroundColor={'#0069ff'}
                                    outline={'1px solid #ccc'}
                                    color='white'
                                >
                                    S. No
                                </Th>
                                <Th
                                    position={'sticky'}
                                    top={0}
                                    backgroundColor={'#0069ff'}
                                    outline={'1px solid #ccc'}
                                    color='white'
                                >
                                    Name
                                </Th>
                                <Th
                                    position={'sticky'}
                                    top={0}
                                    backgroundColor={'#0069ff'}
                                    outline={'1px solid #ccc'}
                                    color='white'
                                >
                                    Roll No
                                </Th>
                                <Th
                                    position={'sticky'}
                                    top={0}
                                    backgroundColor={'#0069ff'}
                                    outline={'1px solid #ccc'}
                                    color='white'
                                >
                                    Sem
                                </Th>
                                <Th
                                    position={'sticky'}
                                    top={0}
                                    backgroundColor={'#0069ff'}
                                    outline={'1px solid #ccc'}
                                    color='white'
                                >
                                    Branch
                                </Th>
                                <Th
                                    position={'sticky'}
                                    top={0}
                                    backgroundColor={'#0069ff'}
                                    outline={'1px solid #ccc'}
                                    color='white'
                                >
                                    From DOTE ID
                                </Th>
                                <Th
                                    position={'sticky'}
                                    top={0}
                                    backgroundColor={'#0069ff'}
                                    outline={'1px solid #ccc'}
                                    color='white'
                                >
                                    From
                                </Th>
                                <Th
                                    position={'sticky'}
                                    top={0}
                                    backgroundColor={'#0069ff'}
                                    outline={'1px solid #ccc'}
                                    color='white'
                                >
                                    To DOTE ID
                                </Th>
                                <Th
                                    position={'sticky'}
                                    top={0}
                                    backgroundColor={'#0069ff'}
                                    outline={'1px solid #ccc'}
                                    color='white'
                                >
                                    To
                                </Th>
                                {/* <Th 
                                    position={'sticky'}
                                    top={0}
                                    backgroundColor={'#0069ff'}
                                    outline={'1px solid #ccc'}
                                    color='white'
                                >
                                    Attendance
                                </Th>
                                <Th 
                                    position={'sticky'}
                                    top={0}
                                    backgroundColor={'#0069ff'}
                                    outline={'1px solid #ccc'}
                                    color='white'
                                >
                                    Sanctioned
                                </Th>
                                <Th 
                                    position={'sticky'}
                                    top={0}
                                    backgroundColor={'#0069ff'}
                                    outline={'1px solid #ccc'}
                                    color='white'
                                >
                                    Admitted
                                </Th>
                                <Th 
                                    position={'sticky'}
                                    top={0}
                                    backgroundColor={'#0069ff'}
                                    outline={'1px solid #ccc'}
                                    color='white'
                                >
                                    Vacancy
                                </Th> */}
                            </Tr>
                        </Thead>

                        <Tbody>
                            {
                                state.visible.map(
                                    (v, idx) => {
                                        const { name, roll_no, sem, branch, from_id, from, to, to_id } = v
                                        const ref = state.visible.length === idx + 30 ? refElement : null
                                        return (
                                            <Tr key={idx} ref={ref}>
                                                <Td
                                                    outline='1px solid #cccccc50'
                                                    fontSize={'13px'}
                                                    display={'flex'}
                                                    alignItems={'center'}
                                                    gap={2}
                                                >
                                                    <Menu matchWidth>
                                                        <MenuButton w='5px'>
                                                            <Image m='auto' cursor={'pointer'} src='/images/three_dots.svg' width='3px' />
                                                        </MenuButton>
                                                        <MenuList backgroundColor={'gray.700'} minW={'0'} w={'90px'} >
                                                            <Suspense fallback={<Spinner />}>
                                                                <EditDataModal data={state.all_data.filter(i => i.id === v.id)[0]} action={edit} />
                                                            </Suspense>

                                                            <MenuItem onClick={() => remove(v.id)} color='white' display={'flex'} gap={2} backgroundColor={'gray.700'} _hover={{backgroundColor: 'black'}}>
                                                                <DeleteIcon
                                                                    __css={{
                                                                        g: {
                                                                            fill: 'white',
                                                                            stroke: 'black'
                                                                        }
                                                                    }}
                                                                />
                                                                Delete
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                    {idx + 1}
                                                </Td>
                                                <Td
                                                    outline='1px solid #cccccc50'
                                                    fontSize={'13px'}
                                                >
                                                    {name}
                                                </Td>
                                                <Td
                                                    outline='1px solid #cccccc50'
                                                    fontSize={'13px'}
                                                >
                                                    {roll_no}
                                                </Td>
                                                <Td
                                                    outline='1px solid #cccccc50'
                                                    fontSize={'13px'}
                                                >
                                                    {sem}
                                                </Td>
                                                <Td
                                                    outline='1px solid #cccccc50'
                                                    fontSize={'13px'}
                                                >
                                                    {branch}
                                                </Td>
                                                <Td
                                                    outline='1px solid #cccccc50'
                                                    fontSize={'13px'}
                                                >
                                                    {from_id}
                                                </Td>
                                                <Td
                                                    outline='1px solid #cccccc50'
                                                    fontSize={'13px'}
                                                >
                                                    {from}
                                                </Td>
                                                <Td
                                                    outline='1px solid #cccccc50'
                                                    fontSize={'13px'}
                                                >
                                                    {to_id}
                                                </Td>
                                                <Td
                                                    outline='1px solid #cccccc50'
                                                    fontSize={'13px'}
                                                >
                                                    {to}
                                                </Td>
                                            </Tr>
                                        )
                                    }
                                )
                            }
                        </Tbody>
                    </Table>


                </TableContainer>
            </Grid>



            <Modal isOpen={modal_is_open} >

            </Modal>
        </>
    )
}
