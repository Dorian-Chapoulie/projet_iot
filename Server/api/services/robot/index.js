let robots = [];

exports.getAll = () => [...robots];

exports.findById = (id) => {
    return robots.find((r) => r.jupiterID === id);
}

exports.addNewRobot = ({ jupiterID, firmware, isAvailable, ip, port, battery }) => {
    robots.push({
        jupiterID,
        firmware,
        isAvailable,
        ip,
        port,
        battery,
    });
}

exports.updateRobot = (data) => {
    robots = robots.filter((r) => r.jupiterID !== data.jupiterID);
    robots.push({
        jupiterID: data.jupiterID,
        firmware: data.firmware,
        isAvailable: data.isAvailable === 'true' ? true : false,
        ip: data.ip,
        port: data.port,
        battery: data.battery,
    });
}

exports.clearList = () => {
    //robots = [];
}