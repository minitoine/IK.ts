//import { NONE, GLOBAL_ROTOR, GLOBAL_HINGE, LOCAL_ROTOR, LOCAL_HINGE, J_BALL, J_GLOBAL, J_LOCAL } from '../constants';

import { Bone3D } from '../core/Bone3D';
import { Chain3D } from '../core/Chain3D';
import { Structure3D } from '../core/Structure3D';
import { V3 } from '../math/V3';


export class IKSolver {
    startBones?: Bone3D;
    endBones?: Bone3D;
    target?: V3;
    goal?: null;
    swivelAngle: number;
    iteration: number;
    thresholds: { position: number, rotation: number };
    solver?: Structure3D;
    chain?: Chain3D;

    constructor() {

        this.goal = null;
        this.swivelAngle = 0;

        this.iteration = 40;

        this.thresholds = { position: 0.1, rotation: 0.1 };

    }


}
