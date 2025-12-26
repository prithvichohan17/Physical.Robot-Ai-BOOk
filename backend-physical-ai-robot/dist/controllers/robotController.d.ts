import { Request, Response } from 'express';
export declare class RobotActions {
    static move(x: number, y: number, z: number): void;
    static rotate(roll: number, pitch: number, yaw: number): void;
    static grab(left: boolean, right: boolean): void;
    static speak(text: string): void;
    static takePhoto(): string;
    static getStatus(): any;
}
export declare const getRobotStatus: (req: Request, res: Response) => void;
export declare const moveRobot: (req: Request, res: Response) => void;
export declare const rotateRobot: (req: Request, res: Response) => void;
export declare const grabObject: (req: Request, res: Response) => void;
export declare const speakText: (req: Request, res: Response) => void;
export declare const takePhoto: (req: Request, res: Response) => void;
export declare const getSensorData: (req: Request, res: Response) => void;
//# sourceMappingURL=robotController.d.ts.map