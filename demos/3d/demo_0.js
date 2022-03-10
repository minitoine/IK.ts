tell("Demo 0 - Human bones");

addTarget(new IK.THREE.Vector3(-30, 15, 0));
addTarget(new IK.THREE.Vector3(30, 15, 0));
addTarget(new IK.THREE.Vector3(-8, -40, 0));
addTarget(new IK.THREE.Vector3( 8, -40, 0));

var startLoc = new IK.V3();

var chain, basebone;

// 0 spine

chain = new IK.Chain3D( 0xFFFF00 );
basebone = new IK.Bone3D( startLoc, new IK.V3( 0, 2, 0 ) );
chain.addBone( basebone );
chain.addConsecutiveRotorConstrainedBone( IK.Y_AXE, 5, 30 );
chain.addConsecutiveRotorConstrainedBone( IK.Y_AXE, 5, 30 );
chain.addConsecutiveRotorConstrainedBone( IK.Y_AXE, 5, 30 );
chain.addConsecutiveRotorConstrainedBone( IK.Y_AXE, 5, 30 );

solver.add( chain, targets[0].position, true );

// 1 left arm

chain = new IK.Chain3D();
basebone = new IK.Bone3D( new IK.V3( 0, 20, 0 ), new IK.V3( -5, 20, 0 ) );
chain.addBone( basebone );
chain.addConsecutiveRotorConstrainedBone( IK.X_NEG, 10, 90 );
chain.addConsecutiveHingedBone( IK.X_NEG, 10, 'global', IK.Y_AXE, 90, 120, IK.X_NEG );
//chain.addConsecutiveHingedBone( IK.X_NEG, 10, IK.J_GLOBAL_HINGE, IK.Y_AXE, 90, 90, IK.Z_AXE );
//chain.addConsecutiveBone( IK.X_NEG, 10 );
//chain.addConsecutiveBone( IK.X_NEG, 10 );
//chain.addConsecutiveBone( IK.X_NEG, 5 );

chain.setRotorBaseboneConstraint( 'local', IK.X_NEG, 10 );
solver.connectChain( chain, 0, 3, 'end', targets[1].position, true, 0x44FF44 );

// 2 right arm

chain = new IK.Chain3D();
basebone = new IK.Bone3D( new IK.V3( 0, 20, 0 ), new IK.V3( -5, 20, 0 ) );
chain.addBone( basebone );
chain.addConsecutiveRotorConstrainedBone( IK.X_AXE, 10, 90 );
chain.addConsecutiveHingedBone( IK.X_NEG, 10, 'global', IK.Y_AXE, 90, 120, IK.X_AXE );
//chain.addConsecutiveBone( IK.X_AXE, 10 );
//chain.addConsecutiveBone( IK.X_AXE, 10 );
//chain.addConsecutiveBone( IK.X_AXE, 5 );

chain.setRotorBaseboneConstraint( 'local', IK.X_AXE, 10 );
solver.connectChain( chain, 0, 3, 'end', targets[2].position, true, 0x4444FF );


// 5 left leg

chain = new IK.Chain3D();
basebone = new IK.Bone3D( new IK.V3( 0, 0, 0 ), new IK.V3( -4, 0, 0 ) );
chain.addBone( basebone );
chain.addConsecutiveRotorConstrainedBone( IK.Y_AXE.negated(), 15, 90 );
chain.addConsecutiveHingedBone( IK.Y_AXE.negated(), 15, 'local', IK.Y_AXE, 1, 120, IK.Z_AXE );
//chain.addConsecutiveBone( IK.Y_AXE.negated(), 15 );
//chain.addConsecutiveBone( IK.Y_AXE.negated(), 15  );

chain.setRotorBaseboneConstraint( 'local', IK.X_NEG, 10 );
solver.connectChain( chain, 0, 0, 'start', targets[3].position, true, 0x44FF44 );


// 5 left right

chain = new IK.Chain3D();
basebone = new IK.Bone3D( new IK.V3( 0, 0, 0 ), new IK.V3( 4, 0, 0 ) );
chain.addBone( basebone );
chain.addConsecutiveRotorConstrainedBone( IK.Y_AXE.negated(), 15, 90 );
chain.addConsecutiveHingedBone( IK.Y_AXE.negated(), 15, 'local', IK.Z_NEG, 1, 120, IK.Z_NEG );
//chain.addConsecutiveBone( IK.Y_AXE.negated(), 15 );
//chain.addConsecutiveBone( IK.Y_AXE.negated(), 15  );

chain.setRotorBaseboneConstraint( 'local', IK.X_AXE, 10 );
solver.connectChain( chain, 0, 0, 'start', targets[4].position, true, 0x4444FF );