import PololuMaestro from "pololu-maestro";
import { ServoControllerFactory, ServoDriver, HardwareInterface, IServoController } from "@fustaro/servo-core";

interface MaestroServoDriver extends ServoDriver {
    ready: boolean;
}
 
export const getOrCreateMaestroController = (uniqueHardwareName: string, portName: string, channels: number, baudRate: number | false = false, debug: boolean = false): IServoController => {
    const controller = ServoControllerFactory.get(uniqueHardwareName);

    if(controller){
        return controller;
    }

    const pololuMaestro = new PololuMaestro(portName, baudRate, debug);

    const servoDriver: MaestroServoDriver = {
        ready: false,
        writePwm: (channel: number, pwm: number, callback?: Function): void => {
            if(servoDriver.ready) pololuMaestro.setTarget(channel, pwm, callback);
        },
        dispose: () => {
            pololuMaestro.close();
        }
    }

    pololuMaestro.on("disconnected", () => {
        console.log(`MaestroServoController: ${uniqueHardwareName} has disconnected`);
        servoDriver.ready = false;
    });
    
    pololuMaestro.on("ready", () => {
        console.log(`MaestroServoController: ${uniqueHardwareName} is ready`);
        servoDriver.ready = true;
    });

    const maestroServoHardwareDriver = new HardwareInterface(servoDriver, uniqueHardwareName, channels, true);

    return ServoControllerFactory.create(maestroServoHardwareDriver);
}
