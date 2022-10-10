import IconButton from '@mui/material/IconButton';

import {
    Badge, Snackbar, Alert

} from "@mui/material";
import {
    CheckCircle,
    Close,
    Done,
    InsertLink,
    LinkOff,
    RadioButtonUnchecked
} from "@mui/icons-material";
import {useContext, useEffect, useState} from "react";
import {hasReachedMax} from "../utils/courses_utils";
import {DataContext} from "../DataContext";


function IconBadgeErrorComp(props) {
    const { row, selected, setSelected, setSelectedCourses, setLastSelectAction} = props

    const [badgeMsg, setBadgeMsg] = useState('')
    const [colorMsg, setColorMsg] = useState('default')
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState('info');
    const {planItemsInContext} = useContext(DataContext)




    useEffect(() => {
        renderIcon()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [row])

    function handleClick(){
        if (!row.state.inPlan && !hasReachedMax(row, planItemsInContext) && row.state.errors.length === 0){
            if (selected){
                setSelectedCourses((old) => old.filter((e) => e.code !== row.code))
                setLastSelectAction(() => ({removed: row.code}))
            }
            else{
                setSelectedCourses((old) => [...old, row])
                setLastSelectAction(() => ({added: row.code}))
            }
            setSelected(!selected)
        }
        else if (row.state.inPlan){
            setOpen(true);
            setSeverity('info')
        }
        else if (hasReachedMax(row, planItemsInContext)){
            setOpen(true);
            setSeverity('error')
        }
        else {
            setOpen(true);
            setSeverity('warning')
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    function renderIcon(){
        if (row.state === undefined){
            return (<></>)
        }
        else if (row.state.inPlan){
            return (
                <Done color={'secondary'}></Done>
            )
        }
        else if (hasReachedMax(row, planItemsInContext)){
            if (badgeMsg !== 'Max')
                setBadgeMsg('Max')
            if (colorMsg !== 'error')
                setColorMsg('error')
            return (
                <Close color={'error'}></Close>
            )
        }
        else if (row.state.errors.length === 0){
            if (badgeMsg !== '')
                setBadgeMsg('')

            return (
                <>
                    {selected ? <CheckCircle color={'primary'}></CheckCircle> : <RadioButtonUnchecked></RadioButtonUnchecked>}
                </>

            )
        }
        else if (row.state.errors.length > 1){
            if (badgeMsg !== '2+')
                setBadgeMsg('2+')
            if (colorMsg !== 'error')
                setColorMsg('error')
            return (
                <Close color={'error'}></Close>
            )
        }
        else if (row.state.errors.length === 1){
            if (row.state.errors[0].startsWith('Incompatibile')){
                if (badgeMsg !== 'Incomp')
                    setBadgeMsg('Incomp')
                if (colorMsg !== 'error')
                    setColorMsg('error')
                return (
                    <LinkOff color={'error'}></LinkOff>
                )
            }
            else if (row.state.errors[0].startsWith('Prima')){
                if (badgeMsg !== 'Prop')
                    setBadgeMsg('Prop')
                if (colorMsg !== 'warning')
                    setColorMsg('warning')

                return (
                    <InsertLink color={'warning'}></InsertLink>
                )
            }
        }

    }


    return <>
        <Badge badgeContent={badgeMsg} color={colorMsg} invisible={badgeMsg === ''}>
            <IconButton
                aria-label="select"
                size="small"
                onClick={() => {
                    handleClick()
                }}
            >
                {renderIcon()}
            </IconButton>

            {row.state ?
                <>
                    <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={severity} sx={{width: '100%'}}>
                            {row.state.inPlan ? 'Corso già inserito nel piano'
                                :
                                hasReachedMax(row, planItemsInContext) ?
                                    'Il corso ha raggiunto il numero massimo di studenti'
                                    : row.state.errors.toString()}
                        </Alert></Snackbar>
                </> : ''}


        </Badge>
    </>
}

export {IconBadgeErrorComp}
