import { fold, iterate, mod, range, wrapSolution } from "../../lib/helper"
import Problem from "../../lib/problem"


type Tile = '#' | '.'

type Grid = Tile[][]

type Coordinate = [number,number]

const movePosition = (c: Coordinate,d: Coordinate): Coordinate => 
    [c[0] + d[0],c[1] + d[1]]
    
const comparePosition = (c: Coordinate,d: Coordinate): boolean => 
    c[0] === d[0] && c[1] === d[1]

const printGrid = (elves: Coordinate[]): void => {
    let grid = range(0,40).map(i => range(0,40).map(j => elves.some(e => e[0] === i - 10 && e[1] === j - 10) ? '#' : '.'))

    grid.forEach(g => console.log(g.join('')))
    console.log('\n')
}

let pos: Coordinate[][] = [[[-1,-1],[-1,0],[-1,1]],[[1,-1],[1,0],[1,1]],[[-1,-1],[0,-1],[1,-1]],[[-1,1],[0,1],[1,1]]]

function doRound(elves: Coordinate[]): Coordinate[] {

    const moved = elves.map(e => {
        const elfpos = pos.map(p => p.map(q => movePosition(q,e)))


        if(!elfpos.some(p => p.some(q => elves.some(g => comparePosition(g,q))))){
            return e
        }

        let proposed = elfpos.findIndex(p => p.every(q => !elves.some(g => comparePosition(g,q))))

        if(proposed === -1){
            return e
        }


        return elfpos[proposed][1]
    })


    const keep = Array.from(Object.entries(fold(
        moved,
        {} as Record<string,{indexes: number[]}>,
        (prev,cur,i) => {
            const str = JSON.stringify(cur)
            if(prev[str]) 
                prev[str].indexes.push(i)
            else
                prev[str] = {indexes: [i]}

            return prev
        }
    ))).flatMap(x => x[1].indexes.length > 1 ? x[1].indexes : [])

    pos.push(pos.shift()!)

    return elves.map((e,i) => keep.includes(i) ? [...e] : moved[i])
}

const solution: Problem<Tile[][],number> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => x.split('') as Tile[])
    },

    solve1(grid){
        const elves: Coordinate[] = []

        grid.forEach((g,i) => {
            g.forEach((h,j) => {
                if(h === '#'){
                    elves.push([i,j])
                }
            })
        })

        const newelves: Coordinate[] = Array.from(iterate(doRound,elves,10))[9]

        const maxY = fold(newelves,0,(prev,cur) => cur[0] > prev ? cur[0] : prev)
        const minY = fold(newelves,Number.MAX_SAFE_INTEGER,(prev,cur) => prev < cur[0] ? prev : cur[0])
        const maxX = fold(newelves,0,(prev,cur) => cur[1] > prev ? cur[1] : prev)
        const minX = fold(newelves,Number.MAX_SAFE_INTEGER,(prev,cur) => prev < cur[1] ? prev : cur[1])


        const area = (maxX - minX + 1) * (maxY - minY + 1) 
        
        return area - newelves.length
    },

    solve2(grid){
        const elves: Coordinate[] = []

        grid.forEach((g,i) => {
            g.forEach((h,j) => {
                if(h === '#'){
                    elves.push([i,j])
                }
            })
        })

        let oldelves = elves
        let i = 1

        for(let newelves of iterate(doRound,elves)) {
            console.log(i)
            if(newelves.every(n => oldelves.some(o => comparePosition(o,n)))){
                return i
            }

            oldelves = newelves
            i++
        }

        throw new Error('unreachable')
    },
}

export default wrapSolution(solution)