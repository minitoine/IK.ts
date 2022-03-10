tell("Demo 2 - Chain with fixed base and multiple unconstrained bones.");

var chain = new IK.Chain2D();
var boneLength = 10;
var basebone = new IK.Bone2D( new IK.V2(), new IK.V2(boneLength, 0) );  
chain.addBone( basebone );

var defaultUV  = new IK.V2(1, 0);
var numBones   = 15;
var rotStep    = 360 / numBones;

for(var i=0; i<numBones; i++){

    var rotatedUV = IK._Math.rotateDegs(defaultUV, i * rotStep);
    chain.addConsecutiveBone(rotatedUV, boneLength);


}

// The the chain to have a fixed base location and, finally, add the chain to the structure
chain.setFixedBaseMode(true);

// Finally, add the chain to the structure
solver.add( chain, target, true );