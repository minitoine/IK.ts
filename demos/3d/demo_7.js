tell("Demo 7 - Local Hinges with Reference Axis Constraints");

// We'll create a circular arrangement of 3 chains with alternate bones each constrained about different local axes.
// Note: Local hinge rotation axes are relative to the rotation matrix of the previous bone in the chain.

var numChains = 3;
var rotStep = 360 / numChains;
var baseBoneConstraintAngleDegs = 20;
var hingeRotationAxis;
var hingeReferenceAxis;
var color = 0xFF0000;

for (var i = 0; i < numChains; i++ ){

    switch (i){
        case 0: color = 0xFF0000; hingeRotationAxis = IK.X_AXE; hingeReferenceAxis = IK.Y_AXE; break;
        case 1: color = 0x00FF00; hingeRotationAxis = IK.Y_AXE; hingeReferenceAxis = IK.X_AXE; break;
        case 2: color = 0x0000FF; hingeRotationAxis = IK.Z_AXE; hingeReferenceAxis = IK.Y_AXE; break;
    }

    var chain = new IK.Chain3D( color );

    var startLoc = new IK.V3( 0, 0, -40 );
    startLoc = IK._Math.rotateYDegs( startLoc, rotStep * i );
    var endLoc = startLoc.plus( defaultBoneDirection.multiply(defaultBoneLength));

    var basebone = new IK.Bone3D( startLoc, endLoc );
    chain.addBone( basebone );

    for (var j = 0; j < 6; j++) {

        //chain.addConsecutiveHingedBone( defaultBoneDirection, defaultBoneLength, 'local', hingeRotationAxis, 90, 90, hingeReferenceAxis );

        if (j % 2 == 0) chain.addConsecutiveHingedBone( defaultBoneDirection, defaultBoneLength, 'local', hingeRotationAxis, 90, 90, hingeReferenceAxis );
        
        else chain.addConsecutiveBone( defaultBoneDirection, defaultBoneLength );

    };

    solver.add( chain, target, true );

}