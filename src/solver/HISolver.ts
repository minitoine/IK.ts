//import { NONE, GLOBAL_ROTOR, GLOBAL_HINGE, LOCAL_ROTOR, LOCAL_HINGE, J_BALL, J_GLOBAL, J_LOCAL } from '../constants';
import { _Math } from '../math/Math';
import { V2 } from '../math/V2';
import { Structure2D } from '../core/Structure2D';
import { Chain2D } from '../core/Chain2D';
import { Bone2D } from '../core/Bone2D';
import { BaseboneConstraintType } from '../constants';
import * as THREE from 'three';
import { V3 } from '../math/V3';


export class HISolver {
    static isHISolver = true;
    startBones?: THREE.Object3D;
    endBones?: THREE.Object3D;
    scene: THREE.Scene;
    target: V3;
    goal: null;
    swivelAngle: number;
    iteration: number;
    thresholds: { position: number, rotation: number };
    solver: Structure2D;
    bones: THREE.Object3D[];
    numBones: number;
    rotation: number[];
    fakeBone: Bone2D;
    angles: number[][];

    
    constructor( o: { scene: THREE.Scene, start: THREE.Object3D, end: THREE.Object3D, angles: number[][] } ) {
            
        this.startBones = null;
        this.endBones = null;

        this.scene = o.scene;

        this.target = null;
        this.goal = null;
        this.swivelAngle = 0;

        this.iteration = 15;

        this.thresholds = { position: 0.1, rotation: 0.1 };

        this.solver = new Structure2D( this.scene );
        //this.chain = null;

        this.bones = [];
        this.numBones = 0;

        this.rotation = [];



        this.initStructure( o );

    }

    initStructure( o: { scene: THREE.Scene, start: THREE.Object3D, end: THREE.Object3D, angles: number[][] } ) {

        this.startBones = o.start;
        this.endBones = o.end;
        this.angles = o.angles;

        let bone = this.startBones, next = bone.children[ 0 ];

        this.bones.push( bone );

        for ( let i = 0; i < 100; i ++ ) {

            this.bones.push( next );
            if ( next === this.endBones ) {

                this.createChain(); break;

            }

            bone = next;

            next = bone.children[ 0 ];

        }

    }

    createChain() {

        this.numBones = this.bones.length;
        const chain = new Chain2D();
        //chain.embeddedTarget = new V2();
        //chain.useEmbeddedTarget = true;
        chain.setFixedBaseMode( true );
        chain.setBaseboneConstraintType( BaseboneConstraintType.LOCAL_ABSOLUTE );

        this.fakeBone = new Bone2D( new V2( 0, - 1 ), new V2( 0, 0 ) );

        this.target = new V3();

        const base = new THREE.Vector3();
        const p0 = new THREE.Vector3();
        const p1 = new THREE.Vector3();
        const uv = new V2();
        let lng = 0;

        for ( let i = 0; i < this.numBones; i ++ ) {

            if ( i > 0 ) {

                this.target.add(new V3(
                    this.bones[ i ].position.x,
                    this.bones[ i ].position.y,
                    this.bones[ i ].position.z
                ));
                lng = base.distanceTo( this.bones[ i ].position );
                this.bones[ i - 1 ].getWorldPosition( p0 );
                this.bones[ i ].getWorldPosition( p1 );
                p1.sub( p0 ).normalize();


                if ( p1.z === 0 ) uv.set( p1.x, p1.y );
                else if ( p1.x === 0 ) uv.set( p1.z, p1.y );
                //uvs.push( uv );

                //console.log( uv, lng, this.angles[i-1][0], this.angles[i-1][1])

                if ( i === 1 ) chain.addBone( new Bone2D( new V2( 0, 0 ), null, uv, lng, this.angles[ i - 1 ][ 0 ], this.angles[ i - 1 ][ 1 ] ) );
                //else chain.addConsecutiveBone( uv, lng );//, this.angles[i-1][0], this.angles[i-1][1] );
                else chain.addConsecutiveBone( uv, lng, this.angles[ i - 1 ][ 0 ], this.angles[ i - 1 ][ 1 ] );

            }

        }

        //if(this.target.z === 0 ) chain.embeddedTarget.set( this.target.x, this.target.y );
        //else if(this.target.x === 0 ) chain.embeddedTarget.set( this.target.z, this.target.y );
        this.target.set( 10, 20, 0 );

        this.solver.add( chain, new V2(this.target.x, this.target.y), true );

        //this.solver.chains[0].embeddedTarget.set(10, 10)


        //console.log( lengths );
        //console.log( this.bones, this.target, this.solver.chains[0].bones );

    }

    update() {

        this.solver.update();

        const bones2d = this.solver.chains[ 0 ].bones;
        const n = this.numBones - 1;

        let a;

        for ( let i = 0; i < n; i ++ ) {

            a = i === 0 ? _Math.findAngle( this.fakeBone, bones2d[ i ] ) : _Math.findAngle( bones2d[ i - 1 ], bones2d[ i ] );
            this.rotation[ i ] = a * _Math.toDeg;
            this.rotation[ i ] += a < 0 ? 180 : - 180;
            this.rotation[ i ] *= - 1;

        }

        for ( let i = 0; i < n; i ++ ) {

            this.bones[ i ].rotation.z = this.rotation[ i ] * _Math.toRad;

        }

        console.log( this.rotation );
        //var r = FIK._Math.findAngle(bones[0], bones[1]);

    }

}
