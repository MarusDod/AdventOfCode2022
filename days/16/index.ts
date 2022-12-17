import { getRandomValues } from "crypto"
import { dropWhile, fold, includesAny, intersection, iterate, maximum, minimum, nub, range, scanl, stagger, takeWhile, wrapSolution, zip } from "../../lib/helper"
import Problem from "../../lib/problem"

type Valve = {
    name: string,
    flowRate: number,
    follows: string[]
}

class Volcanium {
    private valves: Map<string,{
        gain: number,
        follows: string[]
    }>

    private distances: Record<string,Record<string,number>>

    private closedValves: string[]

    constructor(valves: Valve[]){
        this.valves = new Map()

        valves.forEach(v => this.valves.set(v.name,{
            gain: v.flowRate,
            follows: v.follows
        }))

        this.closedValves = valves
            .filter(v => v.flowRate > 0)
            .map(v => v.name)

        this.distances = this.computeDistances()
    }

    computeDistances(): Record<string,Record<string,number>> {
        let q = 0
        const distances = 
            Object.fromEntries(
                Array.from(this.valves.keys()).map(x => 
                    [x,Object.fromEntries(Array.from(this.valves.keys()).map(y => 
                        [y,Number.MAX_SAFE_INTEGER]))]))

        this.valves.forEach((value,key) => {
            distances[key][key] = 0

            value.follows.forEach(v => distances[key][v] = 1)
        })

        this.valves.forEach((_,k) => 
            this.valves.forEach((_,i) => 
                this.valves.forEach((_,j) => {
                    distances[i][j] = minimum(distances[i][j],distances[i][k] + distances[k][j])
                })))


        return distances
    }

    calculatePressure(path: string[],initialTime: number = 30): number{
        return fold(
            path.slice(1),
            {
                time: initialTime,
                pressureReleased: 0,
                prev: 'AA'
            },
            (prev,cur) => {
                const time = prev.time - (this.distances[prev.prev][cur] + 1)

                return {
                    time,
                    pressureReleased: 
                        prev.pressureReleased + (this.valves.get(cur)!.gain * time),
                    prev: cur
                }
            }
        ).pressureReleased
    }

    forkPath(path: string[],time: number,cur: string): string[][] {

        return this.closedValves
            .filter(f => !path.includes(f) && this.distances[cur][f] < time && f != cur)
            .flatMap(f => 
                this.forkPath([...path,cur],time - (this.distances[cur][f] + 1), f))
            .concat([[...path,cur]])
    }

    part1(): number{
        return this.forkPath([],30,'AA')
            .map(x => this.calculatePressure(x))
            .reduce((prev,cur) => cur > prev ? cur : prev,0)
    }

    part2(): number{
        const paths = this.forkPath([],26,'AA').map(x => x.slice(1))

        let maxFlowRate = 0

        for(let i = 0; i < paths.length; i++){
            for(let j = i + 1; j < paths.length; j++){
                if(!includesAny(paths[i],paths[j])){
                    const flowRate = this.calculatePressure(['AA',...paths[i]],26) + this.calculatePressure(['AA',...paths[j]],26)

                    maxFlowRate = maximum(flowRate,maxFlowRate)
                }
            }
        }

        return maxFlowRate
    }
}

const solution: Problem<Valve[],number> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => x.split(' '))
            .map(s => ({
                name: s[1],
                flowRate: parseInt(s[4].split('=')[1].slice(0,-1)),
                follows: s.slice(9).map(n => n.slice(0,2))
            }))
    },

    solve1(valves){
        return new Volcanium(valves).part1()
    },

    solve2(valves){
        return new Volcanium(valves).part2()
    },
}

export default wrapSolution(solution)