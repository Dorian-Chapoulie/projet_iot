let robots = [];

exports.getAll = () => [...robots];

exports.findById = (id) => {
    return robots.find((r) => r.jupiterID === id);
}

exports.addNewRobot = ({ jupiterID, firmware, isAvailable, ip, port, cameraIp }) => {
    robots.push({
        jupiterID,
        firmware,
        isAvailable,
        ip,
        port,
        cameraIp,
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
        cameraIp: data.cameraIp,
    });
}

exports.clearList = () => {
    //robots = [];
}