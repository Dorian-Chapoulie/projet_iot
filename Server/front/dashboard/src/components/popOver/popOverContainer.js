/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { useState } from "react";
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";


import './popOverContainer.css';

const PopOverContainer = () => {

  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  const control = {
    up: {
      name: "Avancer",
      key: "Z",
    },
    down: {
      name: "Reculer",
      key: "S",
    },
    left: {
      name: "Aller à gauche",
      key: "Q",
    },
    right: {
      name: "Aller à droite",
      key: "D",
    },
    accelerate: {
      name: "Accelerer",
      key: "SHIFT",
    },
    decelerate: {
      name: "Ralentir",
      key: "CTRL",
    },
    cameraUp: {
      name: "Camera haut",
      key: "UP",
    },
    cameraDown: {
      name: "Camera bas",
      key: "DOWN",
    },
    cameraLeft: {
      name: "Camera gauche",
      key: "LEFT",
    },
    cameraRight: {
      name: "Camera droite",
      key: "RIGHT",
    },
  };
  return (
    <>
    
    <div className="PopOverContainer">
      <Button className=" mr-2" id="Popover" outline color="info">
        Controles
      </Button>
      <Popover
        placement="bottom"
        isOpen={popoverOpen}
        target="Popover"
        toggle={toggle}
      >
        <PopoverHeader className="text-center h-50 Home-container align-middle">
          Controles
        </PopoverHeader>
        <PopoverBody>
          <ul>
            {Object.keys(control).map((key) => {
              return (
                <li key={key}>
                  {control[key].name} :<b> {control[key].key}</b>
                </li>
              );
            })}
          </ul>
        </PopoverBody>
      </Popover>
    </div>
    </>
  );
};

export default PopOverContainer;
