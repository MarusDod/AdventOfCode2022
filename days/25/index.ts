import { fold, iterate, mod, permutations, range, sum, wrapSolution, zip } from "../../lib/helper"
import Problem from "../../lib/problem"

type SnafuDigit = 0 | 1 | 2 | '-' | '='

const snafuDigits: SnafuDigit[] = [0,1,2,'=','-']

const snafuValues = zip([0,1,2,-2,-1],snafuDigits)

const sumSnafuDigit = (a: SnafuDigit,b: SnafuDigit,carry: number): [SnafuDigit,number] => {
    const sum = snafuValues.find(q => q[1] === a)![0] + snafuValues.find(q => q[1] === b)![0] + carry
    const actualSum = mod(sum,5)

    return [snafuDigits[actualSum],sum < -2 ? -1 : sum > 2 ? 1 : 0]
}

const addSnafus = (a: SnafuDigit[],b: SnafuDigit[]): SnafuDigit[] => {
    let res: SnafuDigit[] = []
    let carry = 0
    const maxLen = Math.max(a.length,b.length)

    a = a.reverse()
    b = b.reverse()

    for(let i of range(maxLen,0)){
        const [sum,newCarry] = sumSnafuDigit(a[i] ?? 0,b[i] ?? 0,carry)

        carry = newCarry

        if(i === maxLen && sum === 0)
            break;

        res.push(sum)
    }

    return res.reverse()
}

const solution: Problem<SnafuDigit[][],string> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => x.split('').map(x => isNaN(parseInt(x)) ? x : parseInt(x))) as SnafuDigit[][]
    },

    solve1(nums){
        return nums.reduce((prev,cur) => addSnafus(prev,cur)).join('')
    },

    solve2(num){
        return '0'
    },
}

export default wrapSolution(solution)