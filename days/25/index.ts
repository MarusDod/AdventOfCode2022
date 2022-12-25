import { fold, iterate, mod, permutations, range, sum, wrapSolution, zip } from "../../lib/helper"
import Problem from "../../lib/problem"

type SnafuDigit = 0 | 1 | 2 | '-' | '='

type Multiplier = (y: number) => number

const toDecimal = (num: SnafuDigit[]): number =>
    fold(
        zip(
            num,
            Array.from(iterate(x => x*5,1/5,num.length)),
        ),
        0,
        (prev,[digit,place]) => prev + (digit === '-' ? -place : digit === '=' ? -(2*place) : digit*place)
    )

const snafuDigits: SnafuDigit[] = [0,1,2,'=','-']

const toSnafu = (num: number): SnafuDigit[] => {
    if(num === 0)
        return []

    const rem = mod(num,5)
    const div = Math.floor(num / 5) + (rem > 2 ? 1 : 0)

    return [...toSnafu(div),snafuDigits[rem]]
}

const solution: Problem<SnafuDigit[][],string> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => x.split('').reverse()) as SnafuDigit[][]
    },

    solve1(nums){
        return toSnafu(sum(nums.map(toDecimal))).join('')
    },

    solve2(num){
        return '0'
    },
}

export default wrapSolution(solution)