import { readFileSync } from "fs"
import { fold, wrapSolution } from "../../lib/helper"
import Problem from "../../lib/problem"

class ThreeSet {
    constructor(private innerList: [number,number,number]) {}

    sum(){
        return this.innerList[0] + this.innerList[1] + this.innerList[2]
    }

    insertIfBigger(x: number): ThreeSet {
        if(x > this.innerList[0]){
            this.innerList[0] = x
            this.innerList.sort()
        }

        return this
    }
}

const solution: Problem<number[][],number> = {
    getData(rawInput: string) {
        
        const lines: string[] = rawInput.split('\n')

        return fold(lines,[[]] as number[][],(el,prev): number[][] => {
            if(el.trim() == ""){
                prev.push([])
                return prev
            }

            prev[prev.length -1].push(parseInt(el))

            return prev
        })
    },

    solve1(calories){
        return calories
            .map(c => c.reduce((prev,cur) => prev + cur,0))
            .reduce((prev,cur) => cur > prev ? cur : prev)
    },

    solve2(calories){
        return calories
            .map(c => c.reduce((prev,cur) => prev + cur,0))
            .reduce((prev,cur) => {
                return prev.insertIfBigger(cur)
            },new ThreeSet([0,0,0]))
            .sum()
    }
}

export default wrapSolution(solution)