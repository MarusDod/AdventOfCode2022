import { wrapSolution } from "../../lib/helper"
import Problem from "../../lib/problem"

type StackState = Array<string>

type MoveInstruction = {
    numCrates: number,
    fromCrate: number,
    toCrate: number
}

const stackState: StackState = [
    "dbjv",
    "pvbwrdf",
    "rgfldcwq",
    "wjpmlndb",
    "hnbpcsq",
    "rdbsng",
    "zbpmqfsh",
    "wlf",
    "svfmr"
].map(x => x.toUpperCase())


const move: (fromIndex: number,toIndex: number,n: number) => void = (fromIndex,toIndex,n) => {
    const str = stackState[fromIndex]

    const [res,rest] = [str.slice(0,str.length - n),str.slice(str.length - n)]
    
    stackState[fromIndex] = res

    stackState[toIndex] = stackState[toIndex].concat(rest.split('').reverse().join(''))
}

const moveV2: (fromIndex: number,toIndex: number,n: number) => void = (fromIndex,toIndex,n) => {
    const str = stackState[fromIndex]

    const [res,rest] = [str.slice(0,str.length - n),str.slice(str.length - n)]
    
    stackState[fromIndex] = res

    stackState[toIndex] = stackState[toIndex].concat(rest)
}

const getLast: () => string = () => stackState.map(x => x[x.length - 1]).join('')


const solution: Problem<MoveInstruction[],string> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .slice(10)
            .filter(x => x.trim() != "")
            .map(x => {
                const line = x.split(' ')

                return {
                    numCrates: parseInt(line[1]),
                    fromCrate: parseInt(line[3]) - 1,
                    toCrate: parseInt(line[5]) - 1,
                }
            })
    },

    solve1(moves){
        moves.forEach((m,index) => move(m.fromCrate,m.toCrate,m.numCrates))

        return getLast()
    },

    solve2(moves){
        moves.forEach((m,index) => moveV2(m.fromCrate,m.toCrate,m.numCrates))

        return getLast()
    }
}

export default wrapSolution(solution)