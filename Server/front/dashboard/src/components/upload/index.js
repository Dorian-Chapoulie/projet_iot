import React, { useCallback, useEffect, useState } from 'react';
import {
  makeStyles,
  Button,
  Container,
  CircularProgress,
  Typography,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { uploadFirmware, flashOTAFirmware} from '../../api/robot';
import { useSockets } from '../../api/websockets';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));



const RobotUploadFirmware = () => {
    const classes = useStyles();
    const { socket } = useSockets();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [uploadSucess, setUploadSucess] = useState(false);
    const [uploadState, setUploadState] = useState('0');
    const [uploadProgress, setUploadProgress] = useState(0);

    const onFileUpload = async (e) => { 
        const file = e.target.files[0];
        if (file) {
            setError(false);
            setUploadSucess(false);
            setIsLoading(true);
            const formData = new FormData(); 
            formData.append( 
                'firmware', 
                file, 
                file.name,
            ); 
            uploadFirmware(formData).then(({ data }) => {
                flashOTAFirmware(socket.id, data.fileName).then(() => {
                    setIsLoading(false);
                    setUploadSucess(true);
                }).catch((err) => {
                    setUploadSucess(false);
                    setIsLoading(false);
                    setError(true);
                });
            }).catch((err) => {
                setUploadSucess(false);
                setIsLoading(false);
                setError(true);
            });
            
        }  
        e.target.value = null;
    }; 

    const onOTAState = ({ state }) => {
        setUploadState(state);
    };

    const onOTAProgress = ({ value }) => {
        setUploadProgress(value);
    };

    useEffect(() => {
        if (!socket) return;

        socket.on('ota_state', onOTAState);
        socket.on('ota_progress', onOTAProgress);

        return () => {
            socket.off('ota_state', onOTAState);
            socket.off('ota_progress', onOTAProgress);
        };
    }, [socket]);

    return (
        <>
            <Container className="white App">
                <Typography className="d-inline white">Uploader un nouveau firmware</Typography>
                <Button
                    variant="contained"
                    color="default"
                    className={classes.button}
                    startIcon={<CloudUploadIcon />}
                    onChange={onFileUpload}
                    component="label"
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress /> : 'Upload'}
                    <input type="file" hidden />
                </Button>
                <br/>
                <Typography className="d-inline">{uploadState}</Typography>
                <Typography className="ml-2 d-inline">{uploadProgress}%</Typography>
                {error && <Alert severity="error">Une erreur est survenue.</Alert>}
                {uploadSucess && <Alert severity="success">Le nouveau firmware est uploadé.</Alert>}
            </Container> 
        </>
    );
}

export default RobotUploadFirmware;
