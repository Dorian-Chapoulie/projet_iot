import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { useHistory  } from 'react-router-dom'
import {
  Container,
  CircularProgress,
  makeStyles,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  LinearProgress,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { fetchList, askCommand } from './api/robot';
import { useSockets } from './api/websockets';
import RobotUploadFirmware from './components/upload';

import './App.css';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function Row({ robot, handleClickControl, isLoading }) {
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {robot.name}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Advanced
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>IP</TableCell>
                    <TableCell align="right">Firmware</TableCell>
                    <TableCell align="right">Battery</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {robot.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                      {historyRow.ip}
                      </TableCell>
                      <TableCell align="right">{historyRow.firmwareVersion}</TableCell>
                      <TableCell align="right">{historyRow.batteryVoltage}v</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                disabled={!robot.isAvailable || isLoading}
                className="d-flex mr-0 ml-auto mt-2 mb-2"
                outline
                color="info"
                onClick={() => handleClickControl(robot.name)}
              >
                {isLoading ? <CircularProgress /> : 'Controler'}
              </Button>
              {robot.error && <Alert severity="warning">Le robot n'est plus disponible.</Alert>}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function createData(robot) {
  return {
    name: robot.jupiterID,
    isAvailable: robot.isAvailable,
    history: [
      {
        ip: `${robot.ip}:${robot.port}`, 
        firmwareVersion: robot.firmware,
        batteryVoltage: robot.battery,
      }
    ],
  };
}

const App = () => {
  const [robots, setRobots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshLoading, setIsRefreshLoading] = useState(false);
  const { socket } = useSockets();
  const history = useHistory();

  useEffect(() => {
    handleFetchList();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshLoading(true);
    await handleFetchList();
    setIsRefreshLoading(false);
  }

  const handleFetchList = async () => {
    const { data } = await fetchList();
    setRobots([]);
    data.forEach((robot) => {
      setRobots((prevState) => ([ ...prevState, createData(robot) ]));
    });
  }
  
  const handleClickControl = async (jupiterID) => {
    setIsLoading(true);
    const { data } = await askCommand(jupiterID, socket.id);
    console.log("ok", data)
    if (data.error) { 
      robots.find((robot) => robot.name === jupiterID).error = true;
      setIsLoading(false);
    } else {
      history.push('/control');
    }
  }

  return (
    <>
      <h1> Liste des robots </h1>
      <Container className="App">
        {isRefreshLoading && <LinearProgress />}
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Nom</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {robots.map((robot) => (
                <Row
                  key={robot.name}
                  robot={robot}
                  handleClickControl={handleClickControl}
                  isLoading={isLoading}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          disabled={isRefreshLoading}
          className="d-flex mr-0 ml-auto mt-2 mb-2"
          outline
          color="info"
          onClick={handleRefresh}
        >
          {isRefreshLoading ? <CircularProgress /> : 'Rafraichir'}
        </Button>
      </Container> 
    </>
  );
}

export default App;
