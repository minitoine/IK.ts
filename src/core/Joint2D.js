import { J_LOCAL, J_GLOBAL, PI, TORAD } from '../constants.js';

export class Joint2D {

	constructor( clockwise, antiClockwise, coordSystem ) {

		this.isJoint2D = true;

		this.coordinateSystem = coordSystem || J_LOCAL;

		if ( clockwise < 0 ) clockwise *= - 1;

		this.min = clockwise !== undefined ? - clockwise * TORAD : - PI;
		this.max = antiClockwise !== undefined ? antiClockwise * TORAD : PI;

	}

	clone() {

		var j = new Joint2D();

		j.coordinateSystem = this.coordinateSystem;
		j.max = this.max;
		j.min = this.min;

		return j;

	}

	validateAngle( a ) {

		a = a < 0 ? 0 : a;
		a = a > 180 ? 180 : a;
		return a;

	}

	// SET

	set( joint ) {

		this.max = joint.max;
		this.min = joint.min;
		this.coordinateSystem = joint.coordinateSystem;

	}

	setClockwiseConstraintDegs( angle ) {

		// 0 to -180 degrees represents clockwise rotation
		if ( angle < 0 ) angle *= - 1;
		this.min = - ( this.validateAngle( angle ) * TORAD );

	}

	setAnticlockwiseConstraintDegs( angle ) {

		// 0 to 180 degrees represents anti-clockwise rotation
		this.max = this.validateAngle( angle ) * TORAD;

	}

	setConstraintCoordinateSystem( coordSystem ) {

		this.coordinateSystem = coordSystem;

	}


	// GET

	getConstraintCoordinateSystem() {

		return this.coordinateSystem;

	}

}
