tell("Demo 8 - Multiple nested chains in a semi-random configuration");

solver.add( createRandomChain(), target, true );
var chainsInStructure = 0;
        
var maxChains = 3;
for ( var i = 0; i < maxChains; i++)
{   
    /*var tempChain = createRandomChain();
    tempChain.setBaseboneConstraintType(IK.BB_LOCAL_RELATIVE);
    tempChain.setBaseboneConstraintUV(IK.UP);*/
    
    solver.connectChain( createRandomChain(), IK._Math.randInt(0, chainsInStructure), IK._Math.randInt(0, 4), 'start', target, true );
    chainsInStructure++
}

function createRandomChain(){

    var boneLength           = 20;
    var boneLengthRatio      = 0.8;      
    var constraintAngleDegs  = 20;
    var constraintAngleRatio = 1.4; 
                
    // ----- Vertical chain -----
    var chain = new IK.Chain2D( IK._Math.rand(0x999999, 0xFFFFFF) );
    chain.setFixedBaseMode( true );   
    
    var basebone = new IK.Bone2D( new IK.V2(), null, IK.UP, boneLength);
    basebone.setClockwiseConstraintDegs(constraintAngleDegs);
    basebone.setAnticlockwiseConstraintDegs(constraintAngleDegs);
    chain.setBaseboneConstraintType(IK.BB_LOCAL_RELATIVE);
    chain.addBone(basebone);    
    
    var numBones = 6;
    var perturbLimit = 0.4;
    for (var i = 0; i < numBones; i++){

        boneLength          *= boneLengthRatio;
        constraintAngleDegs *= constraintAngleRatio;
        var perturbVector  = new IK.V2( IK._Math.rand(-perturbLimit, perturbLimit), IK._Math.rand(-perturbLimit, perturbLimit) );
        
        chain.addConsecutiveBone( IK.UP.plus(perturbVector), boneLength, constraintAngleDegs, constraintAngleDegs );

    }
    
    return chain;
}