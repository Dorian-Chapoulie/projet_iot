import React, { useCallback, useEffect, useState } from 'react';
import uuid from 'react-uuid'
import {
  makeStyles,
  Button,
  Container,
} from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { initInputsEvent } from '../lib/Input';
import { useSockets } from '../api/websockets';
import { uploadFirmware } from '../api/robot';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));



const App = () => {
    const { sendInstruction } = useSockets();
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


    const onFileUpload = (e) => { 
        if (e.target.files[0] !== undefined) {
            const formData = new FormData(); 
            const file = e.target.files[0];
            formData.append( 
                uuid(), 
                file, 
                file.name,
            ); 
            console.log(file);
            uploadFirmware(formData);
        }  
    }; 

    return (
        <>
        <h1> Control </h1>
        <Container className="App">
            <p>test</p>

            
            <Button
                variant="contained"
                color="default"
                className={classes.button}
                startIcon={<CloudUploadIcon />}
                onChange={onFileUpload}
                component="label"
            >
                Upload
                <input type="file" hidden />
            </Button>
        </Container> 
        </>
    );
}
//onChange={(e) => setFile(e.target.files[0])}
export default App;
