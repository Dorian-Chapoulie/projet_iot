export const pressedKeys = [
    {
        state: false,
        value: 'z',
    },
    {
        state: false,
        value: 'q',
    },
    {
        state: false,
        value: 's',
    },
    {
        state: false,
        value: 'd',
    },
    {
        state: false,
        value: ' ',
    },
    {
        state: false,
        value: 'Shift',
    },
    {
        state: false,
        value: 'Control',
    },
];
let callback = undefined;

const onKeyDown = (e) => {
    pressedKeys.forEach(key => {
        if(e.key === key.value && !key.state) {
            key.state = true;
            if (callback) callback(key)
        }
    });  
}

const onKeyUp = (e) => {
    pressedKeys.forEach(key => {
        if(e.key === key.value && key.state) {
            key.state = false;
            callback(key);
        }
    });   
}

export const initInputsEvent = (cb) => {   
    callback = cb;

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
}

export const offInitInputsEvent = () => {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
}