import { fold, iterate, scanl, takeWhile, wrapSolution, zip } from "../../lib/helper"
import Problem from "../../lib/problem"

type Packet = number | Array<Packet>

type Ord = -1 | 0 | 1

function compare(p: Packet,q: Packet): Ord {
    if(typeof p === 'number' && typeof q === 'number'){ 
        return p < q ? -1: p === q ? 0 : 1
    }

    if(typeof p === 'number'){ 
        p = [p]
    }

    if(typeof q === 'number'){ 
        q = [q]
    }

    const res = fold(
        zip(p,q),
        0 as Ord,
        (prev,[x,y]) => prev !== 0 ? prev : compare(x,y))

    if(res === 0)
        return p.length < q.length ? -1 : p.length === q.length ? 0 : 1

    return res
}

const solution: Problem<Array<[Packet,Packet]>,number> = {
    getData(rawInput){
        return rawInput
            .slice(0,-1)
            .split('\n\n')
            .map(x => x.split('\n').map(y => JSON.parse(y)) as [Packet,Packet])
    },

    solve1(pairs){
        return pairs
            .map(([p,q],index) => [index,compare(p,q)] as [number,Ord])
            .filter(([ind,a]) => a === -1)
            .map(([ind,a]) => ind + 1)
            .reduce((prev,cur) => prev + cur,0)
    },

    solve2(pairs){
        let el1 = [[2]]
        let el2 = [[6]]

        return [...pairs.flat(),el1,el2]
            .sort((a,b) => compare(a,b))
            .map((a,index) => [a,index+1] as [Packet,number])
            .filter(([a]) => a === el1 || a === el2)
            .map(([a,index]) => index)
            .reduce((prev,cur) => prev * cur,1)
    },
}

export default wrapSolution(solution)