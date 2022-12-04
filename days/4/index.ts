import { wrapSolution } from "../../lib/helper"
import Problem from "../../lib/problem"

type Range = [number,number]

const fullyOverlaps: (r: Range,s: Range) => boolean = (r,s) => 
    r[0] <= s[0] && r[1] >= s[1]

const partiallyOverlaps: (r: Range,s: Range) => boolean = (r,s) => 
    (r[0] <= s[0] && r[1] >= s[0]) || (r[1] >= s[1] && r[0] <= s[1])

const solution: Problem<Array<[Range,Range]>,number> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .filter(x => x.trim() != "")
            .map(x => x
                .split(',')
                .map(y => y
                    .split('-')
                    .map(y => parseInt(y))) as [Range,Range])
    },

    solve1(rounds){
        return rounds
            .map(ranges => fullyOverlaps(ranges[0],ranges[1]) || fullyOverlaps(ranges[1],ranges[0]))
            .reduce((prev,cur) => cur ? prev + 1: prev,0)
    },

    solve2(rounds){
        return rounds
            .map(ranges => partiallyOverlaps(ranges[0],ranges[1]) || partiallyOverlaps(ranges[1],ranges[0]))
            .reduce((prev,cur) => cur ? prev + 1: prev,0)
    }
}

export default wrapSolution(solution)