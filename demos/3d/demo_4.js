tell("Demo 4 - Freely Rotating Global Hinges");

var numChains = 3;
var rotStep = 360 / numChains;
var baseBoneConstraintAngleDegs = 20;
var globalHingeAxis;
var color = 0xFF0000;

for (var i = 0; i < numChains; i++ ){

    switch (i){
        case 0: color = 0xFF0000; globalHingeAxis = IK.X_AXE; break;
        case 1: color = 0x00FF00; globalHingeAxis = IK.Y_AXE; break;
        case 2: color = 0x0000FF; globalHingeAxis = IK.Z_AXE; break;
    }

    var chain = new IK.Chain3D( color );

    var startLoc = new IK.V3(0, 0, -40);
    startLoc = IK._Math.rotateYDegs( startLoc, rotStep * i );
    var endLoc = startLoc.plus( defaultBoneDirection.multiply( defaultBoneLength ));

    var basebone = new IK.Bone3D( startLoc, endLoc );
    chain.addBone( basebone );


    for (var j = 0; j < 7; j++) {

        if (j % 2 == 0) chain.addConsecutiveFreelyRotatingHingedBone( defaultBoneDirection, defaultBoneLength, 'global', globalHingeAxis );
        else chain.addConsecutiveBone( defaultBoneDirection, defaultBoneLength );

    };

    solver.add( chain, target, true );

}