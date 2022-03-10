tell("Demo 4 - Multiple connected chains with no base-bone constraints.");

var boneLength = 30;
var verticalChain = new IK.Chain2D();
var basebone = new IK.Bone2D( new IK.V2(0,-boneLength), new IK.V2(0, boneLength) );

// Note: Default basebone constraint type is NONE
verticalChain.addBone( basebone );

// Add two additional consecutive Constrained bones
verticalChain.addConsecutiveBone(IK.UP,  boneLength, 90, 90);
verticalChain.addConsecutiveBone(IK.UP,  boneLength,  90, 90);

solver.add( verticalChain, target, true );

// ----- Left branch chain -----                
boneLength = 18;

// Create the base bone and set its colour
basebone = new IK.Bone2D( new IK.V2(), new IK.V2(-boneLength, 0) );

// Create the chain and add the basebone to it
var leftChain = new IK.Chain2D( 0x00ff00 );
leftChain.addBone(basebone);

// Add consecutive constrained bones
// Note: The base-bone is unconstrained, but these bones ARE constrained                
leftChain.addConsecutiveBone( IK.LEFT, boneLength, 90, 90 );
leftChain.addConsecutiveBone( IK.LEFT, boneLength, 90, 90 );

// Add the chain to the structure, connecting to the end of bone 0 in chain 0
solver.connectChain( leftChain, 0, 0, 'end', target, true );

// ----- Right branch chain -----
            
// Create the base bone
basebone = new IK.Bone2D( new IK.V2(), new IK.V2(boneLength, 0) );

// Create the chain and add the basebone to it
var rightChain = new IK.Chain2D( 0xff0000 );
rightChain.addBone(basebone);
                
// Add two consecutive constrained bones to the chain
// Note: The base-bone is unconstrained, but these bones ARE constrained
rightChain.addConsecutiveBone( IK.RIGHT, boneLength, 60, 60 );
rightChain.addConsecutiveBone( IK.RIGHT, boneLength, 60, 60 );

// Add the chain to the structure, connecting to the end of bone 1 in chain 0
solver.connectChain(rightChain, 0, 1, 'end', target, true);