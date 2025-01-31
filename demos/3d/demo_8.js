tell("Demo 8 - Connected Chains");

var chain = new IK.Chain3D( 0x999999 );

var startLoc = new IK.V3( 0, 0, 40 );
var endLoc = startLoc.plus( defaultBoneDirection.multiply(defaultBoneLength) );

var basebone = new IK.Bone3D( startLoc, endLoc );
chain.addBone( basebone );

for (var j = 0; j < 8; j++) {

    chain.addConsecutiveBone( defaultBoneDirection, defaultBoneLength );

};

solver.add( chain, target, true );

var chain2 = new IK.Chain3D( 0xFF9999 );
var base = new IK.Bone3D( new IK.V3(100, 0, 0), new IK.V3(110, 0, 0) );
chain2.addBone(base);
chain2.addConsecutiveBone( IK.X_AXE, 20 );
chain2.addConsecutiveBone( IK.Y_AXE, 20 );
chain2.addConsecutiveBone( IK.Z_AXE, 20 );

solver.connectChain( chain2, 0, 0, 'start', target, true, 0xFF0000 );
solver.connectChain( chain2, 0, 2, 'start', target, true, 0x00FF00 );
solver.connectChain( chain2, 0, 4, 'end'  , target, true, 0x0000FF );