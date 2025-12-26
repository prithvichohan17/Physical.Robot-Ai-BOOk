import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Simulated robot state
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

// Mock actions for the physical robot
export class RobotActions {
  static move(x: number, y: number, z: number): void {
    robotState.position.x = x;
    robotState.position.y = y;
    robotState.position.z = z;
    robotState.lastUpdate = new Date();
    robotState.status = 'moving';
    setTimeout(() => {
      robotState.status = 'idle';
    }, 1000); // Simulate movement time
  }

  static rotate(roll: number, pitch: number, yaw: number): void {
    robotState.orientation.roll = roll;
    robotState.orientation.pitch = pitch;
    robotState.orientation.yaw = yaw;
    robotState.lastUpdate = new Date();
  }

  static grab(left: boolean, right: boolean): void {
    console.log(`Grabbers activated - Left: ${left}, Right: ${right}`);
  }

  static speak(text: string): void {
    console.log(`Robot speech: ${text}`);
    // In a real implementation, this would trigger TTS on the robot
  }

  static takePhoto(): string {
    const photoId = uuidv4();
    console.log(`Photo taken with ID: ${photoId}`);
    return `photo_${photoId}`;
  }

  static getStatus(): any {
    return { ...robotState };
  }
}

export const getRobotStatus = (req: Request, res: Response): void => {
  try {
    const status = RobotActions.getStatus();
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving robot status', error: (error as Error).message });
  }
};

export const moveRobot = (req: Request, res: Response): void => {
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
  } catch (error) {
    res.status(500).json({ message: 'Error moving robot', error: (error as Error).message });
  }
};

export const rotateRobot = (req: Request, res: Response): void => {
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
  } catch (error) {
    res.status(500).json({ message: 'Error rotating robot', error: (error as Error).message });
  }
};

export const grabObject = (req: Request, res: Response): void => {
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
  } catch (error) {
    res.status(500).json({ message: 'Error controlling grabbers', error: (error as Error).message });
  }
};

export const speakText = (req: Request, res: Response): void => {
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
  } catch (error) {
    res.status(500).json({ message: 'Error sending speech command', error: (error as Error).message });
  }
};

export const takePhoto = (req: Request, res: Response): void => {
  try {
    const photoId = RobotActions.takePhoto();
    res.status(200).json({
      message: 'Photo taken',
      photoId,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error taking photo', error: (error as Error).message });
  }
};

export const getSensorData = (req: Request, res: Response): void => {
  try {
    res.status(200).json(robotState.sensors);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving sensor data', error });
  }
};