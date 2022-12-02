import { readFileSync } from "fs"
import Problem from "./problem"

export const fold = <T,A>(array: Array<T>,base: A,fn: (el: T, prev: A) => A): A => {
    array.forEach(ar => {
        const res = fn(ar,base)

        if(res){
            base = res
        }
    })

    return base
}

export const wrapSolution: <T,R,S>(solution: Problem<T,R,S>) => (data: string,part: number) => void = solution => (data,part) => {
    const input = solution.getData(data)

    switch(part){
        case 1:
            console.log(solution.solve1(input))
            break;
        case 2:
            console.log(solution.solve2(input))
            break;
    }
}