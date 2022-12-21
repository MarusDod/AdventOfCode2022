import { assert } from "console"
import { getRandomValues } from "crypto"
import { cycle, dropWhile, fold, includesAny, intersection, iterate, leftsection, maximum, minimum, mod, nub, range, scanl, stagger, sum, takeWhile, wrapSolution, zip } from "../../lib/helper"
import Problem from "../../lib/problem"

type OP = '+' | '-' | '/' | '*' | '='

type Expression = {inputs: string[],op: OP}

type Operation = {
    monkey: string,
    res: number | Expression
}

type EnvState = Record<string,number>

const mathOperation = (op: OP,x: number,y: number): number => {
    switch(op){
        case '*':
            return x*y
        case '+':
            return x+y
        case '-':
            return x-y
        case '/':
            return x/y
        default:
            throw new Error('wha')
    }
}

const resolveName = (name: string,env: EnvState,operations: Operation[]): number => {
    if(env[name]){
        return env[name]
    }

    const op =operations.find(o => o.monkey === name)

    return mathOperation((op!.res as Expression).op,
        resolveName((op!.res as Expression).inputs[0],env,operations),
        resolveName((op!.res as Expression).inputs[1],env,operations)
    )
}


type Operand = {
    type: 'literal',
    literal: number
} | 
{
    type: 'var'
} | {
    type: 'operation'
    op: OP,
    left: Operand,
    right: Operand,
}

const buildOperand = (name: string, operations: Operation[]): Operand => {
    const monkey = operations.find(o => o.monkey === name)!

    if(name === 'humn'){
        return {
            type: 'var'
        }
    }

    if(typeof monkey.res === 'number'){
        return {
            type: 'literal',
            literal: monkey.res
        }
    }

    return {
        type: 'operation',
        op: (monkey.res as Expression).op,
        left: buildOperand((monkey.res as Expression).inputs[0],operations),
        right: buildOperand((monkey.res as Expression).inputs[1],operations),
    }
}

const resolveLiterals = (operand: Operand): Operand => {
    switch(operand.type){
        case 'var':
        case 'literal':
            return operand
        case 'operation': {
            const op1: Operand = resolveLiterals(operand.left)
            const op2: Operand = resolveLiterals(operand.right)

            if(op1.type === 'literal' && op2.type === 'literal'){
                return {
                    type: 'literal',
                    literal: mathOperation(operand.op,op1.literal,op2.literal)
                }
            }

            return {
                ...operand,
                left: op1,
                right: op2,
            }
        }
        defualt:
            throw new Error('heh')
    }
}

const resolveEquation = (num: number,operand: Operand): number => {

    while(operand.type != 'var'){
        switch(operand.type){
            case 'literal':
                throw new Error('wtf')
            case 'operation': {
                const left = operand.left
                const right = operand.right

                if( left.type === 'literal' ){
                    switch(operand.op){
                        case '+':
                            num -= left.literal
                            break;
                        case '*':
                            num = Math.floor(num / left.literal)
                            break;
                        case '-':
                            num = left.literal - num
                            break;
                        case '/':
                            num = Math.floor(left.literal / num)
                            break;
                        default:
                            throw new Error('huh')
                    }

                    operand = right
                }
                else if( right.type === 'literal' ){
                    switch(operand.op){
                        case '+':
                            num -= right.literal
                            break;
                        case '*':
                            num = Math.floor(num / right.literal)
                            break;
                        case '-':
                            num += right.literal
                            break;
                        case '/':
                            num *= right.literal
                            break;
                        default:
                            throw new Error('huh')
                    }

                    operand = left
                }

            }
        }
    }

    return num
}

const solution: Problem<Operation[],number> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => x.split(' '))
            .map(x => ({
                monkey: x[0].replace('\:',''),
                res: !isNaN(parseInt(x[1])) ? parseInt(x[1]) : ({
                    op: x[2],
                    inputs: [x[1],x[3]]
                })
            })) as Operation[]
    },

    solve1(operations){
        const env: EnvState = {}

        for(let op of operations){
            if(typeof op.res === 'number'){
                env[op.monkey]  = op.res
            }
        }

        return resolveName('root',env,operations)
    },

    solve2(operations){
        const env: EnvState = {}

        for(let op of operations){
            if(typeof op.res === 'number'){
                env[op.monkey] = op.res
            }
        }

        const root = operations.find(o => o.monkey === 'root')!

        const operandsLeft = resolveLiterals(buildOperand((root.res as Expression).inputs[0],operations))
        const operandsRight = resolveLiterals(buildOperand((root.res as Expression).inputs[1],operations))

        console.dir(operandsLeft,{depth: null})
        console.dir(operandsRight)

        if(operandsRight.type === 'literal'){
            return resolveEquation(operandsRight.literal,operandsLeft)
        }
        else   
            throw new Error('aaaaa')

    },
}

export default wrapSolution(solution)