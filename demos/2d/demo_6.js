tell("Demo 6 - Multiple connected chains with LOCAL_ABSOLUTE base-bone constraints.");

var boneLength = 30;
var verticalChain = new IK.Chain2D();
verticalChain.setBaseboneConstraintType(IK.GLOBAL_ABSOLUTE);
verticalChain.setBaseboneConstraintUV(IK.UP);

var basebone = new IK.Bone2D( new IK.V2(0,-50), null, IK.UP, boneLength );
basebone.setClockwiseConstraintDegs(15);
basebone.setAnticlockwiseConstraintDegs(15);

// Add the basebone and two additional bones to the chain
verticalChain.addBone( basebone );
verticalChain.addConsecutiveBone(IK.UP,  boneLength, 15, 15);
verticalChain.addConsecutiveBone(IK.UP,  boneLength, 15, 15);


solver.add( verticalChain, target, true );

// ----- Left branch chain -----                
boneLength = 18;

// Create the base bone and set its colour
basebone = new IK.Bone2D( new IK.V2(), new IK.V2(-boneLength, 0) );
basebone.setClockwiseConstraintDegs(15);
basebone.setAnticlockwiseConstraintDegs(15);
// Create the chain and add the basebone to it
var leftChain = new IK.Chain2D( 0x00ff00 );
leftChain.setBaseboneConstraintType(IK.LOCAL_ABSOLUTE);
leftChain.setBaseboneConstraintUV(IK.LEFT);

// Add the basebone to the chain
leftChain.addBone(basebone);

// Add consecutive constrained bones               
leftChain.addConsecutiveBone(IK.LEFT, boneLength, 90, 90);
leftChain.addConsecutiveBone(IK.LEFT, boneLength, 90, 90);

// Add the chain to the structure, connecting to the end of bone 0 in chain 0
solver.connectChain( leftChain, 0, 0, 'end', target, true );

// ----- Right branch chain -----
            
// Create the base bone
basebone = new IK.Bone2D( new IK.V2(), new IK.V2(boneLength, 0) );
basebone.setClockwiseConstraintDegs(30);
basebone.setAnticlockwiseConstraintDegs(30);

// Create the chain and add the basebone to it
var rightChain = new IK.Chain2D( 0xff0000 );
rightChain.setBaseboneConstraintType(IK.LOCAL_ABSOLUTE);
rightChain.setBaseboneConstraintUV(IK.RIGHT);

// Add the basebone to the chain
rightChain.addBone(basebone);
                
// Add two consecutive constrained bones to the chain
rightChain.addConsecutiveBone(IK.RIGHT, boneLength, 90, 90);
rightChain.addConsecutiveBone(IK.RIGHT, boneLength, 90, 90);

// Add the chain to the structure, connecting to the end of bone 1 in chain 0
solver.connectChain(rightChain, 0, 1, 'end', target, true);