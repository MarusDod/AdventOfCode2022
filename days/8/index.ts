import { fold, takeWhile, wrapSolution } from "../../lib/helper"
import Problem from "../../lib/problem"

type Forest = number[][]

const isVisible: (forest: Forest,i: number,j: number) => boolean = 
    (forest,i,j) => {
        const surr = [
            forest.slice(0,i).map(c => c[j]),
            forest.slice(i+1).map(c => c[j]),
            forest[i].slice(0,j),
            forest[i].slice(j+1),
        ]

        return surr.some(s => !s.some(x => x >= forest[i][j]))
    }

const takeWhileShorter: (arr: number[],val: number) => number[] = (arr,val) =>
    takeWhile(arr,x => x < val)


const scenicScore = (forest: Forest,i: number,j: number): number => {
        const surr = [
            forest.slice(0,i).map(c => c[j]).reverse(),
            forest.slice(i+1).map(c => c[j]),
            forest[i].slice(0,j).reverse(),
            forest[i].slice(j+1),
        ]

        return surr
            .map(s => {
                const q = takeWhileShorter(s,forest[i][j]).length
                return q < s.length ? q+1 : q
            })
            .reduce((prev,cur) => prev * cur,1)
}

const solution: Problem<Forest,number> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => x.split('').map(y => parseInt(y)))
    },

    solve1(forest){
        const innerForest = forest.slice(1,-1).map(x => x.slice(1,-1))

        const outerPerimeter = forest.length * 4 - 4
        
        return outerPerimeter + innerForest
            .flatMap((m,i) => m.map((n,j) => isVisible(forest,i+1,j+1)))
            .reduce((prev,cur) => prev + (cur ? 1 : 0),0 as number)
    },

    solve2(forest){
        const innerForest = forest.slice(1,-1).map(x => x.slice(1,-1))

        console.log(forest)

        return innerForest
            .flatMap((m,i) => m.map((n,j) => scenicScore(forest,i+1,j+1)))
            .reduce((prev,cur) => cur > prev ? cur : prev, 0)
    }
}

export default wrapSolution(solution)