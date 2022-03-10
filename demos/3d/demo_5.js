tell("Demo 5 - Global Hinges With Reference Axis Constraints");

var chain = new IK.Chain3D( 0x999999 );

var startLoc = new IK.V3( 0, 30, -40 );
var endLoc = startLoc.clone();
endLoc.y -= defaultBoneLength;

var basebone = new IK.Bone3D( startLoc, endLoc );
chain.addBone( basebone );

for (var j = 0; j < 8; j++) {

	//chain.addConsecutiveHingedBone( IK.Y_NEG, defaultBoneLength, 'global', IK.Y_AXE, 120, 120, IK.Y_NEG );
    if (j % 2 == 0) chain.addConsecutiveHingedBone( IK.Y_NEG, defaultBoneLength, 'global', IK.Z_AXE, 120, 120, IK.Y_NEG );
    else chain.addConsecutiveBone( IK.Y_NEG, defaultBoneLength )

};

solver.add( chain, target, true );