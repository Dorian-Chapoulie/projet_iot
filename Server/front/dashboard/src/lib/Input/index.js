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

export const initInputsEvent = (callback) => {   

    document.addEventListener('keydown', e => {
        pressedKeys.forEach(key => {
            if(e.key === key.value && !key.state) {
                key.state = true;
                callback(key)
            }
        });          
    });

    document.addEventListener('keyup', e => {
        pressedKeys.forEach(key => {
            if(e.key === key.value && key.state) {
                key.state = false;
                callback(key);
            }
        });                  
    });
}