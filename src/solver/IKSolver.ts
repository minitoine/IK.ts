//import { NONE, GLOBAL_ROTOR, GLOBAL_HINGE, LOCAL_ROTOR, LOCAL_HINGE, J_BALL, J_GLOBAL, J_LOCAL } from '../constants';
import { _Math } from '../math/Math';
import { V3 } from '../math/V3';
import { V2 } from '../math/V2';
import { Structure3D } from '../core/Structure3D';
import { Chain3D } from '../core/Chain3D';
import { Bone3D } from '../core/Bone3D';


export class IKSolver {
	static isIKSolver = true;
	startBones: any;
	endBones: any;
	target: any;
	goal: any;
	swivelAngle: any;
	iteration: any;
	thresholds: any;
	solver: any;
	chain: any;

	constructor( o: any ) {

		this.startBones = null;
		this.endBones = null;

		this.target = null;
		this.goal = null;
		this.swivelAngle = 0;

		this.iteration = 40;

		this.thresholds = { position: 0.1, rotation: 0.1 };

		this.solver = null;
		this.chain = null;

	}


}
