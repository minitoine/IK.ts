import { UP, ConnectionType, BaseboneConstraintType } from '../constants';
import { _Math } from '../math/Math';
import { V2 } from '../math/V2';
import { Chain2D } from './Chain2D';
import { Tools } from './Tools';
import * as THREE from 'three';
import { Bone2D } from './Bone2D';

export class Structure2D {
    static isStructure2D = true;
    fixedBaseMode: boolean;
    chains: Chain2D[];
    meshChains: THREE.Mesh[][];
    targets: V2[];
    numChains: number;
    scene: THREE.Scene;
    isWithMesh: boolean;

    constructor( scene: THREE.Scene ) {

        this.fixedBaseMode = true;

        this.chains = [];
        this.meshChains = [];
        this.targets = [];
        this.numChains = 0;

        this.scene = scene || null;

        this.isWithMesh = false;

    }

    update() {

        //console.log('up')

        let chain, mesh, bone, target;
        const tmp = new THREE.Vector3();
        let hostChainNumber;
        let constraintType;

        for ( let i = 0; i < this.numChains; i ++ ) {

            chain = this.chains[ i ];

            target = this.targets[ i ] || null;

            hostChainNumber = chain.getConnectedChainNumber();

            // Get the basebone constraint type of the chain we're working on
            constraintType = chain.getBaseboneConstraintType();

            // If this chain is not connected to another chain and the basebone constraint type of this chain is not global absolute
            // then we must update the basebone constraint UV for LOCAL_RELATIVE and the basebone relative constraint UV for LOCAL_ABSOLUTE connection types.
            // Note: For NONE or GLOBAL_ABSOLUTE we don't need to update anything before calling solveForTarget().
            if ( hostChainNumber !== - 1 && constraintType !== BaseboneConstraintType.GLOBAL_ABSOLUTE ) {

                // Get the bone which this chain is connected to in the 'host' chain
                const hostBone = this.chains[ hostChainNumber ].bones[ chain.getConnectedBoneNumber() ];

                chain.setBaseLocation( chain.getBoneConnectionPoint() === ConnectionType.START ? hostBone.start : hostBone.end );


                // If the basebone is constrained to the direction of the bone it's connected to...
                const hostBoneUV = hostBone.getDirectionUV();

                if ( constraintType === BaseboneConstraintType.LOCAL_RELATIVE ) {

                    // ...then set the basebone constraint UV to be the direction of the bone we're connected to.
                    chain.setBaseboneConstraintUV( hostBoneUV );

                } else if ( constraintType === BaseboneConstraintType.LOCAL_ABSOLUTE ) {

                    // Note: LOCAL_ABSOLUTE directions are directions which are in the local coordinate system of the host bone.
                    // For example, if the baseboneConstraintUV is Vec2f(-1.0f, 0.0f) [i.e. left], then the baseboneConnectionConstraintUV
                    // will be updated to be left with regard to the host bone.

                    // Get the angle between UP and the hostbone direction
                    const angle = UP.getSignedAngle( hostBoneUV );

                    // ...then apply that same rotation to this chain's basebone constraint UV to get the relative constraint UV...
                    const relativeConstraintUV = chain.getBaseboneConstraintUV().clone().rotate( angle );

                    // ...which we then update.
                    chain.setBaseboneRelativeConstraintUV( relativeConstraintUV );

                }

                // NOTE: If the basebone constraint type is NONE then we don't do anything with the basebone constraint of the connected chain.

            } // End of if chain is connected to another chain section

            // Finally, update the target and solve the chain

            if ( ! chain.useEmbeddedTarget ) chain.solveForTarget( target );
            else console.log( 'embed', chain.solveForEmbeddedTarget() );


            // update 3d mesh

            if ( this.isWithMesh ) {

                mesh = this.meshChains[ i ];

                for ( let j = 0; j < chain.numBones; j ++ ) {

                    bone = chain.bones[ j ];
                    mesh[ j ].position.set( bone.start.x, bone.start.y, 0 );
                    mesh[ j ].lookAt( tmp.set( bone.end.x, bone.end.y, 0 ) );

                }

            }


        }

    }

    setFixedBaseMode( value: boolean ) {

        // Update our flag and set the fixed base mode on the first (i.e. 0th) chain in this structure.
        this.fixedBaseMode = value;
        let i = this.numChains, host;
        while ( i -- ) {

            host = this.chains[ i ].getConnectedChainNumber();
            if ( host === - 1 ) this.chains[ i ].setFixedBaseMode( this.fixedBaseMode );

        }
        //this.chains[0].setFixedBaseMode( this.fixedBaseMode );

    }

    clear() {

        this.clearAllBoneMesh();

        let i;

        i = this.numChains;
        while ( i -- ) {

            this.remove( i );

        }

        this.chains = [];
        this.meshChains = [];
        this.targets = [];

    }

    add( chain: Chain2D, target: V2, meshBone?: boolean ) {

        this.chains.push( chain );
        this.numChains ++;

        //if( target.isVector3 ) target = new V2(target.x, target.y);

        if ( target ) this.targets.push( target );


        if ( meshBone ) this.addChainMeshs( chain );

    }

    remove( id: number ) {

        this.chains[ id ].clear();
        this.chains.splice( id, 1 );
        this.meshChains.splice( id, 1 );
        this.targets.splice( id, 1 );
        this.numChains --;

    }

    /*setFixedBaseMode:function( fixedBaseMode ){
        for ( var i = 0; i < this.numChains; i++) {
            this.chains[i].setFixedBaseMode( fixedBaseMode );
        }
    },*/

    getNumChains() {

        return this.numChains;

    }

    getChain( id: number ) {

        return this.chains[ id ];

    }

    connectChain( Chain: Chain2D, chainNumber: number, boneNumber: number, point: string, target: V2, meshBone: THREE.Mesh ) {

        const c = chainNumber;
        const n = boneNumber;

        point = point || 'end';

        if ( c > this.numChains ) {

            Tools.error( 'Chain not existe !' ); return;

        }

        if ( n > this.chains[ c ].numBones ) {

            Tools.error( 'Bone not existe !' ); return;

        }

        // Make a copy of the provided chain so any changes made to the original do not affect this chain
        const chain = Chain.clone();

        chain.setBoneConnectionPoint( point === 'end' ? ConnectionType.END : ConnectionType.START );
        chain.setConnectedChainNumber( c );
        chain.setConnectedBoneNumber( n );

        // The chain as we were provided should be centred on the origin, so we must now make it
        // relative to the start or end position of the given bone in the given chain.

        const position = point === 'end' ? this.chains[ c ].bones[ n ].end : this.chains[ c ].bones[ n ].start;

        //if ( connectionPoint === 'start' ) connectionLocation = this.chains[chainNumber].getBone(boneNumber).start;
        //else connectionLocation = this.chains[chainNumber].getBone(boneNumber).end;


        chain.setBaseLocation( position );

        // When we have a chain connected to a another 'host' chain, the chain is which is connecting in
        // MUST have a fixed base, even though that means the base location is 'fixed' to the connection
        // point on the host chain, rather than a static location.
        chain.setFixedBaseMode( true );

        // Translate the chain we're connecting to the connection point
        for ( let i = 0; i < chain.numBones; i ++ ) {

            chain.bones[ i ].start.add( position );
            chain.bones[ i ].end.add( position );

        }

        this.add( chain, target, !!meshBone );

    }

    // 3D THREE

    addChainMeshs( chain: Chain2D ) {

        this.isWithMesh = true;

        const meshBone = [];

        const lng = chain.bones.length;
        for ( let i = 0; i < lng; i ++ ) {

            meshBone.push( this.addBoneMesh( chain.bones[ i ] ) );

        }

        this.meshChains.push( meshBone );

    }

    addBoneMesh( bone: Bone2D ) {

        const size = bone.length;
        const color = bone.color;
        //console.log(bone.color)
        const g = new THREE.CylinderBufferGeometry( 1, 0.5, size, 4 );
        //g.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, size*0.5, 0 ) );
        g.applyMatrix4( new THREE.Matrix4().makeRotationX( - _Math.pi90 ) );
        g.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 0, size * 0.5 ) );
        //var m = new THREE.MeshStandardMaterial({ color:color });
        const m = new THREE.MeshStandardMaterial( { color: color, wireframe: false } );
        //m.color.setHex( color );

        let extraMesh;
        //let extraGeo;

        /*var type = bone.getJoint().type;
        switch(type){
            case J_BALL :
                m2.color.setHex(0xFF6600);
                var angle  = bone.getJoint().mRotorConstraintDegs;
                if(angle === 180) break;
                var s = size/4;
                var r = 2;//

                extraGeo = new THREE.CylinderBufferGeometry ( 0, r, s, 6 );
                extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) )
                extraGeo.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, s*0.5 ) );
                extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
            case J_GLOBAL_HINGE :
            var a1 = bone.getJoint().mHingeClockwiseConstraintDegs * _Math.torad;
            var a2 = bone.getJoint().mHingeAnticlockwiseConstraintDegs * _Math.torad;
            var r = 2;
            m2.color.setHex(0xFFFF00);
            extraGeo = new THREE.CircleGeometry ( r, 12, a1, a1+a2 );
            extraGeo.applyMatrix4( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
            case J_LOCAL_HINGE :
            var r = 2;
            var a1 = bone.getJoint().mHingeClockwiseConstraintDegs * _Math.torad;
            var a2 = bone.getJoint().mHingeAnticlockwiseConstraintDegs * _Math.torad;
            m2.color.setHex(0x00FFFF);
            extraGeo = new THREE.CircleGeometry ( r, 12, a1, a1+a2 );
            extraGeo.applyMatrix4( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
        }*/




        const b = new THREE.Mesh( g, m );

        b.castShadow = true;
        b.receiveShadow = true;

        this.scene.add( b );
        if ( extraMesh ) b.add( extraMesh );
        return b;

    }

    clearAllBoneMesh() {

        if ( ! this.isWithMesh ) return;

        let i, j, b;

        i = this.meshChains.length;
        while ( i -- ) {

            j = this.meshChains[ i ].length;
            while ( j -- ) {

                b = this.meshChains[ i ][ j ];
                this.scene.remove( b );
                b.geometry.dispose();
                if(b.material instanceof THREE.Material) {
                    b.material.dispose();
                } else {
                    b.material.forEach(m => m.dispose());
                }

            }

            this.meshChains[ i ] = [];

        }

        this.meshChains = [];

    }

}
