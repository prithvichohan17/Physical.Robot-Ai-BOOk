"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSensorData = exports.takePhoto = exports.speakText = exports.grabObject = exports.rotateRobot = exports.moveRobot = exports.getRobotStatus = exports.RobotActions = void 0;
const uuid_1 = require("uuid");
let robotState = {
    id: 'robot-001',
    status: 'idle',
    batteryLevel: 100,
    position: { x: 0, y: 0, z: 0 },
    orientation: { roll: 0, pitch: 0, yaw: 0 },
    connected: true,
    lastUpdate: new Date(),
    sensors: {
        temperature: 22.5,
        humidity: 45,
        proximity: 0,
        light: 500
    }
};
class RobotActions {
    static move(x, y, z) {
        robotState.position.x = x;
        robotState.position.y = y;
        robotState.position.z = z;
        robotState.lastUpdate = new Date();
        robotState.status = 'moving';
        setTimeout(() => {
            robotState.status = 'idle';
        }, 1000);
    }
    static rotate(roll, pitch, yaw) {
        robotState.orientation.roll = roll;
        robotState.orientation.pitch = pitch;
        robotState.orientation.yaw = yaw;
        robotState.lastUpdate = new Date();
    }
    static grab(left, right) {
        console.log(`Grabbers activated - Left: ${left}, Right: ${right}`);
    }
    static speak(text) {
        console.log(`Robot speech: ${text}`);
    }
    static takePhoto() {
        const photoId = (0, uuid_1.v4)();
        console.log(`Photo taken with ID: ${photoId}`);
        return `photo_${photoId}`;
    }
    static getStatus() {
        return { ...robotState };
    }
}
exports.RobotActions = RobotActions;
const getRobotStatus = (req, res) => {
    try {
        const status = RobotActions.getStatus();
        res.status(200).json(status);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving robot status', error: error.message });
    }
};
exports.getRobotStatus = getRobotStatus;
const moveRobot = (req, res) => {
    try {
        const { x, y, z } = req.body;
        if (typeof x !== 'number' || typeof y !== 'number' || typeof z !== 'number') {
            res.status(400).json({ message: 'Invalid coordinates. Expected numbers for x, y, z.' });
            return;
        }
        RobotActions.move(x, y, z);
        res.status(200).json({
            message: 'Movement command sent',
            newPosition: { x, y, z },
            status: 'moving'
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error moving robot', error: error.message });
    }
};
exports.moveRobot = moveRobot;
const rotateRobot = (req, res) => {
    try {
        const { roll, pitch, yaw } = req.body;
        if (typeof roll !== 'number' || typeof pitch !== 'number' || typeof yaw !== 'number') {
            res.status(400).json({ message: 'Invalid rotation values. Expected numbers for roll, pitch, yaw.' });
            return;
        }
        RobotActions.rotate(roll, pitch, yaw);
        res.status(200).json({
            message: 'Rotation command sent',
            newOrientation: { roll, pitch, yaw }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error rotating robot', error: error.message });
    }
};
exports.rotateRobot = rotateRobot;
const grabObject = (req, res) => {
    try {
        const { left, right } = req.body;
        if (typeof left !== 'boolean' || typeof right !== 'boolean') {
            res.status(400).json({ message: 'Invalid grab values. Expected booleans for left and right.' });
            return;
        }
        RobotActions.grab(left, right);
        res.status(200).json({
            message: 'Grab command sent',
            left, right
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error controlling grabbers', error: error.message });
    }
};
exports.grabObject = grabObject;
const speakText = (req, res) => {
    try {
        const { text } = req.body;
        if (typeof text !== 'string') {
            res.status(400).json({ message: 'Invalid text. Expected string.' });
            return;
        }
        RobotActions.speak(text);
        res.status(200).json({
            message: 'Speech command sent',
            text
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error sending speech command', error: error.message });
    }
};
exports.speakText = speakText;
const takePhoto = (req, res) => {
    try {
        const photoId = RobotActions.takePhoto();
        res.status(200).json({
            message: 'Photo taken',
            photoId,
            timestamp: new Date()
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error taking photo', error: error.message });
    }
};
exports.takePhoto = takePhoto;
const getSensorData = (req, res) => {
    try {
        res.status(200).json(robotState.sensors);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving sensor data', error });
    }
};
exports.getSensorData = getSensorData;
//# sourceMappingURL=robotController.js.map