# @fustaro/pololu-maestro-controller

Node Pololu Maestro servo controller

USB Chained Mode (confirmed working on Windows 10, RPI 4 and RPI Zero W)

```npm install @fustaro/pololu-maestro-controller```

### Create a ServoModel, specific to the brand and model of a particular servo

```
const servoModel = new ServoModel({
    pwmRange: { min: 1000, natural: 1500, max: 2000 },
    angleRange: { min: -60, natural: 0, max: 60 },
    speed: 0.1,
    servoDirection: ServoDirection.HIGHER_PWM_CLOCKWISE
});
```

### Create Servo instances, specific to each servo you want to control

```
const servo = new Servo({
    servoModel: servoModel,
    centerOffsetPwm: 0,
    channel: 0,
    flipDirection: false
});
```

### Create your MaestroServoController

```
import { getOrCreateMaestroController } from '@fustaro/pololu-maestro-controller';

const controller = getOrCreateMaestroController(uniqueHardwareName, portName, channels);

//uniqueHardwareName: A unique reference to a given Maestro, e.g. 'Maestro_COM4' 
//                    The ServoControllerFactory will only ever return a single
//                    ServoController for a given uniqueHardwareName

//portName: The USB port to find and connect the Maestro on. 
//          On Windows, this will typically be 'COM1', 'COM2', etc
//          On RPI, this will typically be '/dev/ttyACM0' or '/dev/ttyUSB0'

//channels: The amount of channels this Maestro supports (6, 12, 18, 24 etc)
```

Note on Raspberry Pi running multiple Pololu Maestros from multiple USB ports, you may need
to reference the ports by hardware ID, for example;

```
const port_m1 = '/dev/serial/by-id/usb-Pololu_Corporation_Pololu_Mini_Maestro_12-Channel_USB_Servo_Controller_********-if00';
const port_m2 = '/dev/serial/by-id/usb-Pololu_Corporation_Pololu_Mini_Maestro_12-Channel_USB_Servo_Controller_********-if00';

const servoController_m1 = getOrCreateMaestroController('Maestro_M1', port_m1, 12);
const servoController_m2 = getOrCreateMaestroController('Maestro_M2', port_m2, 12);
```

To get your unique hardware ids, just plug in your Maestros and run;

```
ls /dev/serial/by-id/
```

### Run your servo

```
controller.setAngleDegrees(servo, 40);
```

### Sample scripts

```
import { beginAngleLoop, stopAngleLoop } from '@fustaro/pololu-maestro-controller/dist/samples/angleLoop';

const controller = <create your controller>;
const servo = <create your servo>;

//this will set your servo to 40°, 0°, -40°, 0°, etc - changing every 500ms
beginAngleLoop(controller, servo, [40, 0, -40, 0], 500);
```

```
import { beginSinLoop, stopSinLoop } from '@fustaro/pololu-maestro-controller/dist/samples/sinLoop';

const controller = <create your controller>;
const servo = <create your servo>;

//this will run your servo in a sin loop, +/- 40°
//updating every 15ms and doing 2 full loops every second
beginSinLoop(controller, servo, 40, 15, 2);
```