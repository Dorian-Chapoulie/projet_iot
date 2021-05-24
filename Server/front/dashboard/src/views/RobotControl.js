import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { Container } from "@material-ui/core";
import Iframe from 'react-iframe'
import GaugeChart from 'react-gauge-chart'

import { initInputsEvent, offInitInputsEvent } from "../lib/Input";
import { useSockets } from "../api/websockets";
import RobotUploadFirmware from "../components/upload";

import { ReturnButton } from "../components/returnButton";
import PopOverContainer from "../components/popOver/popOverContainer";

import './RobotControl.css';
const MAX_SPEED = 120;

const RobotControl = () => {
  const { sendInstruction, sendDisconectRobot, socket } = useSockets();
  const history = useHistory();
  const [defaultValues, setDefaultValues] = useState({
    speed: MAX_SPEED, // [0, MAX_SPEED]
    positionH: 90, //[0, 180]
    positionV: 90, //[0, 180]
  });
  const [intervalD, setIntervalD] = useState(false);
  const [intervalQ, setIntervalQ] = useState(false);
  const [intervalCL, setIntervalCL] = useState(false);
  const [intervalCR, setIntervalCR] = useState(false);
  const [intervalCU, setIntervalCU] = useState(false);
  const [intervalCD, setIntervalCD] = useState(false);
  const [showModalDisconnected, setShowModalDisconnected] = useState(false);
  const [showModalNotConnected, setShowModalNotConnected] = useState(false);

  useEffect(() => {
    initInputsEvent(handleKeyPressed);
    if (!socket) {
      history.push("/");
      return;
    }
    sendInstruction("Shift");
    socket.on("robot_disconnected", handleRobotDisconnected);
    socket.on("robot_not_connected", handleRobotNotConnected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      sendDisconectRobot();
      offInitInputsEvent();
      socket.off("robot_disconnected", handleRobotDisconnected);
      socket.off("robot_not_connected", handleRobotNotConnected);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (intervalD) {
      const interval = setInterval(() => {
        sendInstruction("d");
      }, 100);
      return () => clearInterval(interval);
    }
  }, [intervalD, sendInstruction]);

  useEffect(() => {
    if (intervalQ) {
      const interval = setInterval(() => {
        sendInstruction("q");
      }, 100);
      return () => clearInterval(interval);
    }
  }, [intervalQ, sendInstruction]);

  useEffect(() => {
    if (intervalCL) {
      const interval = setInterval(() => {
        sendInstruction("arrowleft");
      }, 100);
      return () => clearInterval(interval);
    }
  }, [intervalCL, sendInstruction]);

  useEffect(() => {
    if (intervalCR) {
      const interval = setInterval(() => {
        sendInstruction("arrowright");
      }, 100);
      return () => clearInterval(interval);
    }
  }, [intervalCR, sendInstruction]);

  useEffect(() => {
    if (intervalCU) {
      const interval = setInterval(() => {
        sendInstruction("arrowup");
      }, 100);
      return () => clearInterval(interval);
    }
  }, [intervalCU, sendInstruction]);

  useEffect(() => {
    if (intervalCD) {
      const interval = setInterval(() => {
        sendInstruction("arrowdown");
      }, 100);
      return () => clearInterval(interval);
    }
  }, [intervalCD, sendInstruction]);

  const handleKeyPressed = (key) => {
    if (key.value === "d") {
      if (key.state) {
        sendInstruction(key.value);
        setIntervalD(true);
        setIntervalQ(false);
      } else {
        setIntervalD(false);
      }
    } else if (key.value === "q") {
      if (key.state) {
        sendInstruction(key.value);
        setIntervalQ(true);
        setIntervalD(false);
      } else {
        setIntervalQ(false);
      }
    } else if (key.value === "ArrowUp") {
      if (key.state) {
        sendInstruction(key.value);
        setIntervalCU(true);
        setIntervalCD(false);
      } else {
        setIntervalCU(false);
      }
    } else if (key.value === "ArrowDown") {
      if (key.state) {
        sendInstruction(key.value);
        setIntervalCD(true);
        setIntervalCU(false);
      } else {
        setIntervalCD(false);
      }
    } else if (key.value === "ArrowLeft") {
      if (key.state) {
        sendInstruction(key.value);
        setIntervalCL(true);
        setIntervalCR(false);
      } else {
        setIntervalCL(false);
      }
    } else if (key.value === "ArrowRight") {
      if (key.state) {
        sendInstruction(key.value);
        setIntervalCR(true);
        setIntervalCL(false);
      } else {
        setIntervalCR(false);
      }
    } else if (key.value === "z" || key.value === "s") {
      if (key.state) {
        sendInstruction(key.value);
      } else {
        sendInstruction(" ");
      }
    } else if (key.state) {
      if(key.value === 'Shift') {
        setDefaultValues((prevState) => ({
          ...prevState,
          speed: prevState.speed < MAX_SPEED ? prevState.speed + 10 : MAX_SPEED,
        }));
      }
      if(key.value === 'Control') {
        setDefaultValues((prevState) => ({
          ...prevState,
          speed: prevState.speed > 10 ? prevState.speed - 10 : 0,
        }));
      }
      sendInstruction(key.value);
    }
  };
  console.log(defaultValues.speed)
  const handleRobotDisconnected = () => {
    setShowModalDisconnected(true);
  };

  const handleRobotNotConnected = () => {
    setShowModalNotConnected(true);
  };

  const toggleModalDisconnected = () => {
    history.push("/");
  };
  
  return (
    <>
      <Modal isOpen={showModalDisconnected} toggle={toggleModalDisconnected}>
        <ModalHeader toggle={toggleModalDisconnected}>
          Robot déconnecté
        </ModalHeader>
        <ModalBody>La connection au robot à été perdu.</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleModalDisconnected}>
            Ok
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={showModalNotConnected} toggle={toggleModalDisconnected}>
        <ModalHeader toggle={toggleModalDisconnected}>
          Robot non connecté
        </ModalHeader>
        <ModalBody>
          Revenez au menu pour sélectionner le robot à piloter.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleModalDisconnected}>
            Ok
          </Button>
        </ModalFooter>
      </Modal>
      <PopOverContainer />
      <ReturnButton />
      <Card>
        <CardHeader>
          <h1 className="text-center"> Panneau de commande</h1>
        </CardHeader>
        <CardBody>
          <Iframe
            url={`http://${window.cameraIp}`}
            className="camera"
          />
          <p>Vitesse: </p>
          <GaugeChart
            style={{ height: '250px' }}
            textColor="black"
            className="gauge"
            id="gauge-chart2" 
            nrOfLevels={20} 
            percent={defaultValues.speed / MAX_SPEED} 
          />
        </CardBody>
      </Card>

      <Container className="App">
        <RobotUploadFirmware />
      </Container>
    </>
  );
};

export default RobotControl;
