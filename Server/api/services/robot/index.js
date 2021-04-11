const robots = [];

exports.getAll = () => robots;

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