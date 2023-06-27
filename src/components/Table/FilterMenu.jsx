import { Button, Checkbox, Flex, Menu, MenuButton, MenuItem, MenuList, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text } from "@chakra-ui/react"
import { memo, useCallback, useEffect, useReducer, useRef, useState } from "react"


const reducer = (state, action) => {
    switch (action.type) {
        case 'init':
            return {
                map: action.map,
                all: action.payload,
                shown: action.payload.slice(0, 20),
                selected: action.payload
            }
        // case 'add':
        //     return {
        //         ...state,
        //         all: [...state, action.payload],
        //     }
        // case 'remove':
        //     return {
        //         all: state.filter(i => i !== action.payload),
        //         shown: state.shown.filter(i => i !== action.payload)
        //     }
        case 'more':
            return {
                ...state,
                shown: state.shown.concat(state.all.slice(state.shown.length, state.shown.length + 20))
            }
        case 'select': 
            return {
                ...state,
                selected: action.payload
            }
        default:
            return state
    }
}

function FilterMenu({ filter, visible, dispatch }) {
    const [list, dispatch_list] = useReducer(reducer, {map: new Map(), all: [], shown: [], selected: new Set()})

    const [isOpen, setIsOpen] = useState(false)
    // const [selected, set_selected] = useState()
    // const [all, set_all] = useState([])

    
    const init = () => {
        const map = new Map()
        for (let i = 0; i < visible.length; i++) {
            const current = visible[i]
            const value = current[filter.key]
            if (!map.has(value)) {
                map.set(value, new Set([current._idx]))
            } else {
                map.get(value).add(current._idx)
            }
        }
        // set_selected([...map.keys()])
        // set_all([...map.keys()])
        dispatch_list({type: 'init', payload: [...map.keys()], map})
    }

    useEffect(() => {
        init()
    }, [visible])

    const add_or_remove = (checked, value) => {
        const new_selected = new Set([...list.selected])
        if(checked) {
            new_selected.add(value)
        }else{
            new_selected.delete(value)
        }
        dispatch_list({type: 'select', payload: new_selected})
    }

    const submit = () => {
        const new_visible = new Set()
        for(let i = 0; i < visible.length; i++) {
            for(let s of list.selected){
                // console.log(s, list.map.get(s));
                for(let li of [...list.map.get(s)])
                    new_visible.add(visible[li])
            }
        }
        console.log([...new_visible]);
        // dispatch([...new_visible])  

        setIsOpen(false)
    }

    useEffect(() => {
        console.log(list.selected);
    }, [list.selected])

    const toggle = () => { setIsOpen(!isOpen) }

    const observe = useRef(null)
    const refElement = useCallback(node => {
        if (observe.current) observe.current.disconnect()
        observe.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                dispatch_list({ type: 'more' })
            }
        })
        if (node) observe.current.observe(node)
    }, [list.shown])

    return (
        <>
            <Popover isOpen={isOpen}>
                <PopoverTrigger>
                    <Button
                        onClick={toggle}
                    >{filter.title}</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow  />
                    <PopoverCloseButton 
                        bgColor='white' 
                        onClick={() => { setIsOpen(false) }}
                    />
                    <PopoverHeader
                        color='white'
                    >
                        <Button 
                            backgroundColor='transparent'
                            color='white'
                            _hover={{backgroundColor: 'transparent', borderColor: '#ccc'}}
                            border='1px solid #cccccc50'
                            onClick={submit}
                        >Save</Button>
                    </PopoverHeader>
                    <PopoverBody
                        h='300px'
                        overflowY={'scroll'}
                    >
                        {
                            list.shown.map((i, idx) => {
                                const ref = list.shown.length === idx + 10 ? refElement : null
                                return (
                                    <Checkbox
                                        key={idx}
                                        color={'white'}
                                        size={'sm'}
                                        w='100%'
                                        defaultChecked={true}
                                        onChange={e => { add_or_remove(e.target.checked, i) }}
                                        ref={ref}
                                        p={1}
                                        borderRadius={'4px'}
                                        _hover={{backgroundColor: '#00000050'}}
                                    >
                                        <Text
                                            fontSize={'14px'}
                                            color='white'
                                        >
                                            {i}
                                        </Text>
                                    </Checkbox>
                                )
                            })
                        }
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    )
}


export default memo(FilterMenu)


{/* <Menu isOpen={isOpen}> */}
{/* <MenuButton */}
    // borderRadius={'5px'}
    // backgroundColor={'#081b4b'}
    // onClick={toggle}
{/* > */}
    {/* <Flex alignItems={'center'} p={2} gap={2}> */}
        {/* <Text fontSize={'13px'} color='white'>{filter.title}</Text> */}
        {/* <Text fontSize={'13px'} color={'white'}>{ } selected</Text> */}
    {/* </Flex> */}
{/* </MenuButton> */}
{/* <MenuList */}
// 
{/* > */}
    {/* <MenuItem */}
        // display={'flex'}
        // flexDirection={'column'}
        // h='200px'
        // overflowY={'scroll'}
        // pos='relative'
        // resize='both'
    // >
        {/* {/* <Text */}
            // backgroundColor={'red'} 
            // px={1} 
            // pos='fixed' 
            // top={'10px'}
            // right={'-60px'}
            // borderRadius={'5px'}
            // fontSize={'13px'}
            // color='white'
            // onClick={close} 
        // >Close</Text> */}
{/*  */}
        {/* { */}
        //    all.map((i, idx) => {
                // return (
                //  <Checkbox
                    // key={idx}
                    //   color={'white'}
                    //   size={'sm'}
                    //   w='100%'
                    //   defaultChecked={true}
                    //   onChange={e => {add_or_remove(e.target.checked, i)}}
                //  >
                      {/* <Text */}
                            // fontSize={'14px'}
                            // color='white'
                    //   >
                            {/* {i} */}
                      {/* </Text> */}
                 {/* </Checkbox> */}
                // )
            // })
        // }
{/*  */}
        {/* {/* { */}
            // Array(500).map((i, idx) => <Checkbox key={idx}>HEllo</Checkbox>)
        // } */}
    {/* </MenuItem> */}
{/*  */}
    {/* <MenuItem */}
        // backgroundColor={'#081b4b80'}
        // w='50%'
        // m='auto'
        // borderRadius={'5px'}
        // _hover={{
            // transform: 'scale(1.05)',
            // backgroundColor: '#081b4b'
        // }}
        // onClick={submit}
    // >
        {/* <Text  */}
            // color='white'
            // fontSize={'13px'}
            // m='auto'
        // >
            {/* Okay */}
        {/* </Text> */}
    {/* </MenuItem> */}
{/* </MenuList> */}
{/* </Menu> */}
