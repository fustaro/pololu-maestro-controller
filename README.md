# @fustaro/pololu-maestro-controller

Node Pololu Maestro servo controller

USB Chained Mode (confirmed working on Windows 10, RPI 4 and RPI Zero W)

## Create a ServoModel, specific to the brand and model of a particular servo

```
const servoModel = new ServoModel({
    pwmRange: { min: 1000, natural: 1500, max: 2000 },
    angleRange: { min: -60, natural: 0, max: 60 },
    speed: 0.1,
    servoDirecton: ServoDirection.HIGHER_PWM_CLOCKWISE
});
```

## Create Servo instances, specific to each servo you want to control

```
const servo = new Servo({
    servoModel: servoModel,
    centerOffsetPwm: 0,
    channel: 0,
    flipDirection: false
});
```

## Create your MaestroServoController

```
import { getOrCreateController } from '@fustaro/pololu-maestro-controller';

const controller = getOrCreateController('Maestro_COM4', 'COM4', 16);
```

### getOrCreateController(uniqueHardwareName: string, portName: string, channels: number)

uniqueHardwareName: A unique reference to a given Maestro. 
                    The ServoControllerFactory will only ever return a single
                    ServoController for a given uniqueHardwareName

portName: The USB port to find and connect the Maestro on. 
          On Windows, this will typically be COM1, COM2, etc
          On RPI, this will typically be '/dev/ttyACM0' or '/dev/ttyUSB0'

channels: The amount of channels this Maestro supports (6, 12, 18, 24 etc)

## Run your servo

```
controller.setAngleDegrees(servo, 40);
```