tell("Demo 7 - Varying-offset 'fixed' chains with embedded targets");

addTarget(new THREE.Vector3(-30, 15, 0));
addTarget(new THREE.Vector3(30, 15, 0));

var boneLength = 50;
var startY = -100;

var chain = new IK.Chain2D();
var basebone = new IK.Bone2D( new IK.V2(0, startY), new IK.V2(0, startY + boneLength) );
basebone.setClockwiseConstraintDegs(65);
basebone.setAnticlockwiseConstraintDegs(65);
chain.addBone( basebone );

// Fix the base bone to its current location, and constrain it to the positive Y-axis
chain.setFixedBaseMode(true);       
chain.setBaseboneConstraintType(IK.GLOBAL_ABSOLUTE);
chain.setBaseboneConstraintUV(IK.UP);

// Add second and third bones
chain.addConsecutiveBone(IK.UP, boneLength);
chain.addConsecutiveBone(IK.UP, boneLength);

solver.add( chain, target, true );

// ----- Left branch chain -----                
//boneLength = 18;

// Create the base bone and set its colour
basebone = new IK.Bone2D( new IK.V2(), new IK.V2(-boneLength/6, 0) );
// Create the chain and add the basebone to it
var leftChain = new IK.Chain2D( 0x00ff00 );
leftChain.setBaseboneConstraintType(IK.LOCAL_RELATIVE);

// Add fifteen bones
leftChain.addBone(basebone);
for (var i = 0; i < 14; i++){   
    leftChain.addConsecutiveBone(IK.RIGHT, boneLength / 6, 25, 25);
}


// Add the chain to the structure, connecting to the end of bone 0 in chain 0
solver.connectChain( leftChain, 0, 1, 'start', targets[1].position, true );

// ----- Right branch chain -----
            
// Create the base bone
basebone = new IK.Bone2D( new IK.V2(), new IK.V2(boneLength/5, 0) );
basebone.setClockwiseConstraintDegs(60);
basebone.setAnticlockwiseConstraintDegs(60);

// Create the chain and add the basebone to it
var rightChain = new IK.Chain2D( 0xff0000 );
rightChain.setBaseboneConstraintType(IK.LOCAL_ABSOLUTE);
rightChain.setBaseboneRelativeConstraintUV(IK.RIGHT);

// Add ten bones
rightChain.addBone(basebone);
for (var i = 0; i < 14; i++){   
    rightChain.addConsecutiveBone(IK.RIGHT, boneLength / 5);
}
                

// Add the chain to the structure, connecting to the end of bone 1 in chain 0
solver.connectChain(rightChain, 0, 2, 'start', targets[2].position, true);

var mSmallRotatingTargetLeft  = new IK.V2(-70., 40);
var mSmallRotatingTargetRight = new IK.V2( 50, 20);
var mRotatingOffset = new IK.V2( 0, 0);
var mSmallRotatingOffsetLeft  = new IK.V2( 25, 0);
var mSmallRotatingOffsetRight = new IK.V2( 0, 30); 

extraUpdate = function(){

    //if(!mSmallRotatingOffsetLeft && !mSmallRotatingOffsetRight && !mRotatingOffset) return

    mRotatingOffset = IK._Math.rotateDegs(mRotatingOffset, 1.0);
    var mOrigBaseLocation = solver.chains[0].getBaseLocation()
    solver.chains[0].setBaseLocation( mOrigBaseLocation.plus(mRotatingOffset) );

    // Rotate offsets for left and right chains
    mSmallRotatingOffsetLeft  = IK._Math.rotateDegs(mSmallRotatingOffsetLeft, -1.0);
    mSmallRotatingOffsetRight = IK._Math.rotateDegs(mSmallRotatingOffsetRight, 2.0);

    var t1 = mSmallRotatingTargetLeft.plus(mSmallRotatingOffsetLeft);
    var t2 = mSmallRotatingTargetRight.plus(mSmallRotatingOffsetRight);

    targets[1].position.x = t1.x;
    targets[1].position.y = t1.y;

    targets[2].position.x = t2.x;
    targets[2].position.y = t2.y;

    updateTarget(targets[1].position, 1);
    updateTarget(targets[2].position, 2)

}