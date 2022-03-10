import { Tools } from '../core/Tools';
import { V2 } from './V2';
import { V3 } from './V3';

export const _Math = {

    toRad: Math.PI / 180,
    toDeg: 180 / Math.PI,
    pi90: Math.PI * 0.5,

    // Center point is p1; angle returned in Radians
    //findAngle: function ( p0, p1, p2 ) {
    findAngle: function<T extends V2, Bone extends { start: T, end: T }>( b0: Bone, b1: Bone ) {

        /*var a = p1.minus(p2).lengthSq(),
            b = p1.minus(p0).lengthSq(),
            c = p2.minus(p0).lengthSq(),*/
        const a = b0.end.minus( b1.end ).lengthSq(),
            b = b0.end.minus( b0.start ).lengthSq(),
            c = b1.end.minus( b0.start ).lengthSq();
        let angle;

        const r = ( a + b - c ) / Math.sqrt( 4 * a * b );
        if ( r <= - 1 ) angle = Math.PI;
        else if ( r >= 1 ) angle = 0;
        else angle = Math.acos( r );
        // sign
        const sign = b0.end.x * b1.end.y - b0.end.y * b1.end.x;
        return sign >= 0 ? angle : - angle;

    },

    clamp: function ( v: number, min: number, max: number ) {

        v = v < min ? min : v;
        v = v > max ? max : v;
        return v;

    },

    lerp: function ( x: number, y: number, t: number ) {

        return ( 1 - t ) * x + t * y;

    },

    rand: function ( low: number, high: number ) {

        return low + Math.random() * ( high - low );

    },

    randInt: function ( low: number, high: number ) {

        return low + Math.floor( Math.random() * ( high - low + 1 ) );

    },

    nearEquals: function ( a: number, b: number, t: number ) {

        return Math.abs( a - b ) <= t ? true : false;

    },

    perpendicular: function ( a: V3, b: V3 ) {

        return _Math.nearEquals( a.dot( b ), 0.0, 0.01 ) ? true : false;

        //return _Math.nearEquals( _Math.dotProduct(a, b), 0.0, 0.01 ) ? true : false;

    },

    genPerpendicularVectorQuick: function ( v: V3 ) {

        //return _Math.genPerpendicularVectorFrisvad( v );

        const p = v.clone();
        // cross(v, UP) : cross(v, RIGHT)
        return Math.abs( v.y ) < 0.99 ? p.set( - v.z, 0, v.x ).normalize() : p.set( 0, v.z, - v.y ).normalize();

    },

    /*genPerpendicularVectorHM: function ( v ) {

        var a = v.abs();
        var b = v.clone();
        if (a.x <= a.y && a.x <= a.z) return b.set(0, -v.z, v.y).normalize();
        else if (a.y <= a.x && a.y <= a.z) return b.set(-v.z, 0, v.x).normalize();
        else return b.set(-v.y, v.x, 0).normalize();

    },*/

    genPerpendicularVectorFrisvad: function ( v: V3 ) {

        const nv = v.clone();
        if ( v.z < - 0.9999999 ) return nv.set( 0, - 1, 0 );// Handle the singularity
        const a = 1 / ( 1 + v.z );
        return nv.set( 1 - v.x * v.x * a, - v.x * v.y * a, - v.x ).normalize();

    },

    // rotation

    rotateXDegs: function ( v: V2 | V3, angle: number ) {

        return v.clone().rotate( angle * _Math.toRad, 'X' );

    },
    rotateYDegs: function ( v: V2 | V3, angle: number ) {

        return v.clone().rotate( angle * _Math.toRad, 'Y' );

    },
    rotateZDegs: function ( v: V3, angle: number ) {

        return v.clone().rotate( angle * _Math.toRad, 'Z' );

    },

    // distance

    withinManhattanDistance: function ( v1: V3, v2: V3, distance: number ) {

        if ( Math.abs( v2.x - v1.x ) > distance ) return false; // Too far in x direction
        if ( Math.abs( v2.y - v1.y ) > distance ) return false; // Too far in y direction
        if ( Math.abs( v2.z - v1.z ) > distance ) return false; // Too far in z direction
        return true;

    },

    manhattanDistanceBetween: function ( v1: V2 | V3, v2: V2 | V3 ) {

        return Math.abs( v2.x - v1.x ) + Math.abs( v2.x - v1.x ) + Math.abs( v2.x - v1.x );

    },

    distanceBetween: function ( v1: V2 | V3, v2: V2 | V3 ) {

        const dx = v2.x - v1.x;
        const dy = v2.y - v1.y;
        const dz = v1 instanceof V3 && v2 instanceof V3 ? v2.z - v1.z : 0;
        return Math.sqrt( dx * dx + dy * dy + dz * dz );

    },

    // ______________________________ 2D _____________________________

    rotateDegs: function ( v: V2, angle: number ) {

        return v.clone().rotate( angle * _Math.toRad );

    },


    validateDirectionUV: function ( directionUV: V2 ) {

        if ( directionUV.length() < 0 ) Tools.error( 'vector direction unit vector cannot be zero.' );

    },

    validateLength: function ( length: number ) {

        if ( length < 0 ) Tools.error( 'Length must be a greater than or equal to zero.' );

    },



};
