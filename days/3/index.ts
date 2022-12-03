import { fold, wrapSolution } from "../../lib/helper";
import Problem from "../../lib/problem";

import { match } from 'ts-pattern';

type LineReducer<T> = (prev: T,cur: string) => T

const getCharCount: (x: number) => number = x => x >= 'a'.charCodeAt(0) ? x - 'a'.charCodeAt(0) + 1 : x - 'A'.charCodeAt(0) + 27

const threeLineReducer: LineReducer<{
    index: number,
    lines: string[][]
}> = ({index,lines},cur) => {
    if(index == 0){
        return {
            index: 1,
            lines: lines.concat([[cur]])
        }
    }

    lines[lines.length-1].push(cur)

    return {
        index: index === 2 ? 0 : index+1,
        lines
    }
}

const solution: Problem<Array<string>,number> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .filter(x => x.trim() != "")
    },

    solve1(rounds){
        console.log(rounds
            .map(x => [x.substring(0,x.length/2),x.substring(x.length/2)])
            .map(([first,second]) => {
                for(let i = 0;i < first.length; i++){
                    const c = first[i]

                    if(second.includes(c)){
                        return getCharCount(c.charCodeAt(0))
                    }
                }

                throw new Error('')
            }))
        return rounds
            .map(([first,second]) => {
                for(let i = 0;i < first.length; i++){
                    const c = first[i]

                    if(second.includes(c)){
                        return getCharCount(c.charCodeAt(0))
                    }
                }

                throw new Error('')
            })
            .reduce((prev,cur) => prev + cur,0)

    },

    solve2(rounds){
        console.log(fold(rounds,{index: 0,lines: []},threeLineReducer)
            .lines)

        return fold(rounds,{index: 0,lines: []},threeLineReducer)
            .lines
            .map(groups => {
                for(let i = 0;i < groups[0].length; i++){
                    const c = groups[0][i]

                    if(groups[1].includes(c) && groups[2].includes(c)){
                        return getCharCount(c.charCodeAt(0))
                    }
                }

                throw new Error('')
            })
            .reduce((prev,cur) => prev + cur,0)
    }
}

export default wrapSolution(solution)