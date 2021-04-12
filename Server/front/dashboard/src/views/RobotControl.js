import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Container,
} from '@material-ui/core'
import { initInputsEvent, offInitInputsEvent } from '../lib/Input';
import { useSockets } from '../api/websockets';
import RobotUploadFirmware from '../components/upload';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));


const RobotControl = () => {
    const { sendInstruction, sendDisconectRobot } = useSockets();
    const classes = useStyles();
    const [defaultValues, setDefaultValues] = useState({
        speed: 200, // [0, 255]
        position: 90, //[0, 180]
    });
    const [intervalD, setIntervalD] = useState(false);
    const [intervalQ, setIntervalQ] = useState(false);

    useEffect(() => {
        initInputsEvent(handleKeyPressed);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => {
            sendDisconectRobot();
            offInitInputsEvent();
        }
    }, []);

    useEffect(() => {
        if (intervalD) {
            const interval = setInterval(() => {
                sendInstruction('d');
            }, 200);
            return () => clearInterval(interval);
        }
    }, [intervalD, sendInstruction]);

    useEffect(() => {
        if (intervalQ) {
            const interval = setInterval(() => {
                sendInstruction('q');
            }, 200);
            return () => clearInterval(interval);
        }
    }, [intervalQ, sendInstruction]);

    const handleKeyPressed = (key) => {
        console.log(key.value);
        if(key.value === 'd') {
            if (key.state) {
                sendInstruction('d');
                setIntervalD(true);
                setIntervalQ(false);
            } else {
                setIntervalD(false);
            }
        } else if(key.value === 'q') {
            if (key.state) {
                sendInstruction('q');
                setIntervalQ(true);
                setIntervalD(false);
            } else {
                setIntervalQ(false);
            }
        } else if (key.value === 'z' || key.value === 's') {
            if (key.state) {
                sendInstruction(key.value);
            }else {
                sendInstruction(' ');
            }
        } else if(key.state) {
            sendInstruction(key.value);
        }
    };


    return (
        <>
        <h1> Control </h1>
        <Container className="App">
            <RobotUploadFirmware />
        </Container> 
        </>
    );
}

export default RobotControl;
