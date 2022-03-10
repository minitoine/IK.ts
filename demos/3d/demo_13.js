tell("Demo 13 - Global Hinges With Reference Axis Constraints");



var position = new IK.THREE.Vector3(0,18.258,0);

var vectorsObj = {
        V0:new IK.THREE.Vector3(0,0,9.48),
        V1:new IK.THREE.Vector3(0,0,21),
        V2:new IK.THREE.Vector3(14.2,0,0),
        V3:new IK.THREE.Vector3(25,0,0),
        V4:new IK.THREE.Vector3(0,0,-27.275),//-5.96-21.315
        V5:new IK.THREE.Vector3(8,0,0),
    }

var x = IK.X_AXE
var y = IK.Y_AXE
var z = IK.Z_AXE

var nx = IK.X_NEG
var ny = IK.Y_NEG
var nz = IK.Z_NEG

var chain = new IK.Chain3D( 0x999999 );

var startLoc = new IK.V3( 0, 18.258+9.48, 0 );
var endLoc = startLoc.clone();
endLoc.y += 21+14.2+25//9.48//18.258;

var basebone = new IK.Bone3D( startLoc, endLoc );
chain.addBone( basebone );

//chain.setRotorBaseboneConstraint( 'global', y, 90);
//chain.setHingeBaseboneConstraint( 'global', y, 180,180, z)
var ax = IK.Z_AXE


chain.addConsecutiveRotorConstrainedBone( y, 27.275, 180 );
//chain.addConsecutiveRotorConstrainedBone( y, 39.2, 180 );
//chain.addConsecutiveRotorConstrainedBone( y, 39.2, 180 );




//chain.addConsecutiveRotorConstrainedBone( y, 14.2, 0 );
//chain.addConsecutiveRotorConstrainedBone( y, 25, 180 );
//chain.addConsecutiveFreelyRotatingHingedBone( y, 9.48, 'local', nx)
//chain.addConsecutiveHingedBone( y, 21, 'local', y, 150, 150, z );
//chain.addConsecutiveHingedBone( y, 21, 'global', z, 150, 150, x );
//chain.addConsecutiveHingedBone( y, 21, 'local', z, 150, 150, perp(ny) );
//chain.addConsecutiveRotorConstrainedBone( y, 21, 0 )

//chain.addConsecutiveHingedBone( IK.Y_AXE, 21, 'local', IK.Y_NEG, 150, 150, perp(IK.Y_NEG) );

//chain.setHingeBaseboneConstraint( 'global', IK.Z_AXE, 180, 180, IK.Y_AXE);

//chain.addConsecutiveFreelyRotatingHingedBone(IK.Y_AXE, 9.48, 'local', IK.Y_NEG)

//var p = IK._Math.genPerpendicularVectorQuick( IK.Y_NEG )


//chain.addConsecutiveHingedBone( IK.Y_AXE, 14.2, 'global', IK.Y_NEG, 150, 150, perp(IK.Y_NEG) );
//chain.addConsecutiveHingedBone( IK.Y_AXE, 21, 'local', IK.Y_AXE, 120, 120, IK.Y_NEG );

/*for (var j = 0; j < 8; j++) {

	//chain.addConsecutiveHingedBone( IK.Y_NEG, defaultBoneLength, 'global', IK.Y_AXE, 120, 120, IK.Y_NEG );
    //chain.addConsecutiveHingedBone( IK.Y_NEG, defaultBoneLength, 'global', IK.Y_AXE, 120, 120, IK.Y_NEG );
    chain.addConsecutiveHingedBone( IK.Y_NEG, defaultBoneLength, 'local', IK.Y_AXE, 120, 120, IK.Y_NEG );
    //else chain.addConsecutiveBone( IK.Y_NEG, defaultBoneLength )

};*/

solver.add( chain, target, true );


function perp( v ){
	return IK._Math.genPerpendicularVectorQuick( v )
}