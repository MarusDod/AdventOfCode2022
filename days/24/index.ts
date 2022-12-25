import { fold, iterate, mod, range, wrapSolution } from "../../lib/helper"
import Problem from "../../lib/problem"

type Arrow = '<' | '>' | 'v' | '^'

type Trail = '#' | '.' | Arrow

type Board = Map<number,Map<number,Trail>>

type Coordinate = [number,number]
type Elf = [number,number,Facing]

enum Facing {
    right = 0,
    down = 1,
    left = 2,
    up = 3,
}

const lcm = (n1: number, n2: number): number => {
    let lar = Math.max(n1, n2);
    let small = Math.min(n1, n2);
    
    let i = lar;
    while(i % small !== 0){
      i += lar;
    }
    
    return i;
}

class Blizzard {
    public beg: Coordinate
    public destiny: Coordinate
    private elfCycles: Elf[][]
    public maxCycles: number
    private queue: Array<{
        time: number,
        coord: Coordinate,
    }>

    private seen: Array<{
        cycle: number,
        coord: Coordinate,
    }>
    
    constructor(elves: Elf[],private max: Coordinate){
        this.maxCycles = lcm(max[0]-1,max[1]-1)

        this.seen = []
        this.queue = []
        this.beg = [0,0]
        this.destiny = [0,0]

        this.elfCycles = [elves].concat(Array.from(iterate(
            elves => elves.map(e => this.moveElf(e)),elves,this.maxCycles-1)))
    }

    withPath(beg: Coordinate,destiny: Coordinate): Blizzard {
        this.beg = beg
        this.destiny = destiny

        return this
    }

    run(start: number): number{
        this.queue = [{coord: [...this.beg],time: start}]
        this.seen = [{
            coord: [...this.beg],
            cycle:start % this.maxCycles,
        }]

        while(true) {
            const {time,coord} = this.queue.shift()!

            const cycle = (time + 1) % this.elfCycles.length

            if(this.overlap(coord,this.destiny)){
                return time
            }

            const neighbours = this.getNeighbours(coord,cycle)

            neighbours.forEach(n => {
                this.queue.push({coord: n,time: time+1})

                this.seen.push({
                    cycle,
                    coord: n
                })
            })
        }

        throw new Error('unreachable')
    }

    getNeighbours(current: Coordinate,cycle: number): Coordinate[]{
        const pos: Coordinate[] = [[1,0],[0,1],[0,-1],[-1,0],[0,0]]

        return pos
            .map(p => this.move(p,current))
            .filter(p => !this.elfCycles[cycle].some(e => this.overlap([e[0],e[1]],p)) && !(this.isWall(p) && !this.overlap(p,this.destiny) && !this.overlap(p,this.beg)) && !this.seen.some(s => s.cycle === cycle && this.overlap(s.coord,p)))
            //.sort((a,b) => this.distance(a,this.destiny) - this.distance(b,this.destiny))
    }

    isWall(coord: Coordinate): boolean {
        return coord[0] < 1 || coord[0] >=  this.max[0]  || coord[1] < 1 || coord[1] >= this.max[1]
    }

    overlap(a: Coordinate,b: Coordinate): boolean {
        return a[0] === b[0] && a[1] === b[1]
    }

    move(a: Coordinate,b: Coordinate): Coordinate {
        return [a[0] + b[0], a[1] + b[1]]
    }

    moveElf(e: Elf): Elf{
        let coord: Coordinate

        switch(e[2]){
            case Facing.down:
                coord = this.move([e[0],e[1]],[1,0])

                if(this.isWall(coord)){
                    coord = [1,e[1]]
                }
                break;
            case Facing.up:
                coord = this.move([e[0],e[1]],[-1,0])

                if(this.isWall(coord)){
                    coord = [this.max[0]-1,e[1]]
                }
                break;
            case Facing.left:
                coord = this.move([e[0],e[1]],[0,-1])

                if(this.isWall(coord)){
                    coord = [e[0],this.max[1]-1]
                }
                break;
            case Facing.right:
                coord = this.move([e[0],e[1]],[0,1])

                if(this.isWall(coord)){
                    coord = [e[0],1]
                }
                break;
        }

        return [...coord,e[2]]
    }
}

const solution: Problem<[Blizzard,Coordinate,Coordinate],number> = {
    getData(rawInput){
        const board = rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => x.split(''))

        const elves: Elf[] = []

        board.forEach((b,i) => {
            b.forEach((g,j) => {
                switch(g){
                    case '.':
                    case '#':
                        break;
                    default:
                        elves.push([i,j,g === '<' ? Facing.left : g === '>' ? Facing.right : g === 'v' ? Facing.down : Facing.up])
                }
            })
        })

        return [
            new Blizzard(elves,[board.length-1,board[0].length-1]),
            [0,1],
            [board.length - 1,board.at(-1)!.indexOf('.')],
        ]
    },

    solve1([blizzard,beg,end]){
        return blizzard.withPath(beg,end).run(0)
    },

    solve2([blizzard,beg,end]){
        const timeFirst = blizzard.withPath(beg,end).run(0)
        const timeSecond = blizzard.withPath(end,beg).run(timeFirst)

        const timeThird = blizzard.withPath(beg,end).run(timeSecond)

        return timeThird
    },
}

export default wrapSolution(solution)