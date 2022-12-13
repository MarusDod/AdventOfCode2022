import { wrapSolution } from "../../lib/helper"
import Problem from "../../lib/problem"

const myPositionLetter = 'S'.charCodeAt(0) - 97
const destinationLetter = 'E'.charCodeAt(0) - 97

type Square = [number,number]

class Grid {
    private openSet: Array<Square>
    private closedSet: Array<Square>
    private costMap: Map<string,number>
    private initialPosition: Square
    private destinationPosition: Square

    constructor(public grid: number[][]) {
        this.initialPosition = this.findLetter(myPositionLetter)[0]
        this.destinationPosition = this.findLetter(destinationLetter)[0]

        this.openSet = []
        this.closedSet = []
        this.costMap = new Map()

        this.grid[this.initialPosition[0]][this.initialPosition[1]] = 'a'.charCodeAt(0) - 97
        this.grid[this.destinationPosition[0]][this.destinationPosition[1]] = 'z'.charCodeAt(0) - 97
    }

    dijkstra(beg: Square = this.initialPosition): number {
        this.openSet = [beg]
        this.costMap = new Map()
        this.costMap.set(JSON.stringify(beg),0)
        this.closedSet = []

        while(true){
            if(this.openSet.length === 0)
                break;

            const cur = this.openSet.shift()!
            const cost = this.costMap.get(JSON.stringify(cur))!

            const adj = this.findAdjacent(cur)

            adj
            .filter(a => !this.closedSet.find(x => this.compareSquare(a,x)))
            .filter(s => this.getIndex(s) - this.getIndex(cur) <= 1)
            .forEach(a => {
                const oldCost = this.costMap.get(JSON.stringify(a))
                const newcost = cost + 1

                if(!oldCost) {
                    this.openSet.push(a)
                    this.costMap.set(JSON.stringify(a),newcost)
                }
                else if(newcost >= oldCost)
                        return
                else
                    this.costMap.set(JSON.stringify(a),newcost)

            })
            
            this.closedSet.push(cur)
        }

        const destAdj = this.findAdjacent(this.destinationPosition)
            .filter(s => this.getIndex(s) === this.getIndex(this.destinationPosition))

        return 1 + Array
            .from(this.costMap.entries())
            .filter(([square,cost]) => destAdj.some(d => this.compareSquare(d,JSON.parse(square as string) as Square)))
            .map(x => x[1])
            .reduce((prev,cur) => prev < cur ? prev : cur,Number.MAX_SAFE_INTEGER)
    }

    findLetter(letter: number): Square[]{
        const res: Square[] = []

        for(const [i,row] of this.grid.entries()){
            for(const [j,col] of row.entries()){
                if(col === letter)
                    res.push([i,j])
            }
        }

        return res
    }

    private compareSquare(x: Square,y: Square): boolean {
        return x[0] === y[0] && y[1] === x[1]
    }

    private getIndex(square: Square): number {
        return this.grid[square[0]][square[1]]
    }

    private findAdjacent(square: Square): Square[] {
        return [[-1,0],[0,-1],[1,0],[0,1],]
            .map(([y,x]) => [y + square[0],x + square[1]] as Square)
            .filter(([y,x]) => y >= 0 && x >= 0 && y < this.grid.length && x < this.grid[0].length)
    }

}



const solution: Problem<Grid,number> = {
    getData(rawInput){
        return new Grid(rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => x.split('').map(c => c.charCodeAt(0) - 97)))
    },

    solve1(grid){
        return grid.dijkstra()
    },

    solve2(grid){
        const as = grid.findLetter('a'.charCodeAt(0) - 97)

        return as
            .map(a => [a,grid.dijkstra(a)] as [Square,number])
            .sort((a,b) => a[1] - b[1])[0][1]
    },
}

export default wrapSolution(solution)