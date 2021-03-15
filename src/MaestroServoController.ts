import PololuMaestro from "pololu-maestro";
import { ServoControllerFactory, PwmWriter, HardwareInterface, IServoController } from "@fustaro/servo-core";

interface MaestroServoDriver extends PwmWriter {
    ready: boolean;
}
 
export const getOrCreateController = (uniqueHardwareName: string, portName: string, channels: number): IServoController => {
    let controller = ServoControllerFactory.get(uniqueHardwareName);

    if(!controller){
        const pololuMaestro = new PololuMaestro(portName, false);

        const servoDriver: MaestroServoDriver = {
            ready: false,
            writePwm(channel: number, pwm: number, callback?: Function): void {
                if(servoDriver.ready) pololuMaestro.setTarget(channel, pwm, callback);
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

        controller = ServoControllerFactory.create(maestroServoHardwareDriver);
    }

    return controller;
}