
function repmat(array, count) {
    var result = [];
    while (count--) {
        result = result.concat(array);
    }
    return result;
}

function genArray(value, count) {
    var result = []
    while(count--) {
        result.push(value)
    }
    return result
}

function rand(min, max) {
    var value = Math.floor(Math.random() * (max - min + 1) + min)
    while(value == undefined) {
        value = Math.floor(Math.random() * (max - min + 1) + min)
    }
    return value
}

function randElement(arr) {
    const random = Math.floor(Math.random() * arr.length);
    return arr[random]
}

function arrAdd(a,b) {
    x = [];
    for(var i = 0;i<=b.length-1;i++)
        x.push(a[i] + b[i]);
    return x
}

function arrSub(a,b) {
    x = [];
    for(var i = 0;i<=b.length-1;i++)
        x.push(a[i] - b[i]);
    return x
}

///objective functions
function calcObjective(x) {
    /* //return Math.pow(value, 2)
    const d = Math.sqrt(x.length)
    return 1+((1/4000)*Math.pow(sum(x)), 2) - prod(Math.cos(x/Math.pow(d, 0.5)))//prod; */
    //console.log("calcObjective ==> x: %o", x)
    let arr_val = x.map(val => Math.pow(val, 2))
    //console.log("calcObjective ==> arr val ^2: %o", arr_val)
    let sum_val = sum(arr_val)
    //console.log("calcObjective ==> sum_val %o", sum_val)
    return sum_val
}

function sum(input){
    if (toString.call(input) !== "[object Array]") {
        return false;
    }
    
    var total =  0;
    for(var i=0;i<input.length;i++){                  
        if(isNaN(input[i])){
            continue;
        }
        total += Number(input[i]);
    }
    return total;
}

function prod(input){
    if (toString.call(input) !== "[object Array]") {
        return false;
    }
    
    var total =  0;
    for(var i=0;i<input.length;i++){                  
        if(isNaN(input[i])){
            continue;
        }
        total *= Number(input[i]);
    }
    return total;
}

///fitness function
function calcFitness(value) {
    if (value >= 0)
    return 1 / (1+value)
    else 
    return 1 + Math.abs(value)//abs(value);
}

function min(array) {
    let min = Math.min.apply(Math, array)
    let index = array.indexOf(min)
    return {min, index}
}

function minBound(array, max) {
    var index = Math.min.apply(array.length, max)
    return array[index]
}

function maxValueBound(value, max) {
    return value <= max ? value : max
}

function minValueBound(value, min) {
    return value >= min ? value : min
}

function max(array) {
    let max = Math.max.apply(Math, array)
    let index = array.indexOf(max)
    return {max, index}
}

function maxBound(array, max) {
    var index = Math.max.apply(array.length, max)
    return array[index]
}

function combineTwo(arrayA,arrayB) {
    var jarray = [];
    for (var i=0; i<arrayA.length && i<arrayB.length; i++)
    jarray[i] = [arrayB[i], arrayA[i]];
    return jarray
}

function genNewSol(lb, up, Np, n, P, fit, trial, objective, D) {
    let j = rand(0,D - 1 )
    var p = rand(0,Np - 1)
    
    while (p == n) {
        p = rand(0,Np - 1)
    }
    
    
    console.log("n: %o",n)
    console.log("lb: %o, up: %o", lb, up)
    console.log("decisions: %o, populationSize: %o", D, Np)
    console.log("j: %o, p: %o", j, p)
    
    console.log("arr fitness %o", fit)
    console.log("arr objective %o", objective)
    
    var newSol = [...P[n]]
    
    console.log("new Sol %o", newSol)
    
    //random value between -1,1
    var phi = -1 + (1-(1))*Math.random()
    
    newSol[j] = P[n][j] + 
    phi * 
    (P[n][j] - 
        P[p][j])
        
        console.log("pre bound %o", newSol[j]);
        
        newSol[j] = minValueBound(newSol[j], up[j])
        newSol[j] = maxValueBound(newSol[j], lb[j])
        
        let objSol = calcObjective(newSol)
        let fitSol = calcFitness(objSol)
        
        if (fitSol > fit[n]) {
            console.log("no trial newSol %o", newSol)
            P[n] = newSol
            fit[n] = fitSol
            objective[n] = objSol
            trial[n] = 0 
        } else {
            console.log("has trial")
            trial[n] = trial[n] + 1
        }
        
        const obj = {
            trial: trial,
            population : P,
            arr_fitness: fit,
            arr_objectives: objective
        }
        
        console.log("trial: %o, population : %o, arr_fitness: %o, arr_objectives: %o", trial, P, fit, objective)
        
        return obj
    }