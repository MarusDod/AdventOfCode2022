import { getRandomValues } from "crypto"
import { cycle, dropWhile, fold, includesAny, intersection, iterate, maximum, minimum, nub, range, scanl, stagger, takeWhile, wrapSolution, zip } from "../../lib/helper"
import Problem from "../../lib/problem"

type Unit = '#' | '.' | '@'
type Rock = Unit[][]

type Square = [number,number]

type Movement = 'left' | 'right'

type AnyMovement = 'down' | Movement


const moveSquare = <M extends AnyMovement>(m: M,s: Square): Square => {
    switch(m){
        case 'down':
            return [s[0] - 1,s[1]]
        case 'left':
            return [s[0],s[1] - 1]
        case 'right':
            return [s[0],s[1] + 1]
        default:
            throw new Error('wha')
    }
}

const rocks: Rock[] = [
    [
        ['#','#','#','#']
    ],
    [
        ['.','#','.'],
        ['#','#','#'],
        ['.','#','.']
    ],
    [
        ['.','.','#'],
        ['.','.','#'],
        ['#','#','#']
    ].reverse() as Rock,
    [
        ['#'],
        ['#'],
        ['#'],
        ['#'],
    ],
    [
        ['#','#'],
        ['#','#']
    ],
]

class Tetris {
    private board: Set<string>

    constructor(){
        this.board = new Set()
    }

    canMove(square: Square,rock: Rock): boolean {
        if(square[1] < 0 || square[1] >= 7 || square[0] < 0){
            return false
        }

        for(let i = 0;i < rock.length; i++){
            for(let j = 0;j < rock[0].length; j++){
                if((this.board.has(JSON.stringify([square[0] + i,square[1] + j])) || this.board.has(JSON.stringify([square[0] + i,square[1] + j]))) && rock[i][j] === '#' || j + square[1] >= 7){
                    return false
                }
            }
        }

        return true
    }

    getBoardHeight(): number {
        return Array.from(this.board.values())
            .map(b => parseInt(JSON.parse(b)[0]))
            .reduce((prev,cur) => cur > prev ? cur : prev,0)
    }

    paint(square: Square, rock: Rock): void {
        for(let i = 0;i < rock.length; i++){
            for(let j = 0;j < rock[0].length; j++){
                if(rock[i][j] === '#'){
                    this.board.add(JSON.stringify([square[0] + i,square[1] + j]))
                }
            }
        }
    }

    play(moves: Movement[],maxFallen: number){
        let currentSquare: Square = [4,2]
        let extraHeight = 0

        let rocksIter = cycle(rocks)
        let movesIter = cycle(moves)
        let fallenRocks = 0

        const states: Map<string,{
            height: number,
            numPieces: number
        }> = new Map()

        let move: Movement = 'left'

        while(fallenRocks < maxFallen){
            const rock = rocksIter.next().value
            let highest = this.getBoardHeight()
            currentSquare = [highest+ 4,2]

            while(true){
                move = movesIter.next().value

                const jetPosition = moveSquare(move,currentSquare)

                if(this.canMove(jetPosition,rock)) {
                    currentSquare = jetPosition
                }

                const downPosition = moveSquare('down',currentSquare)

                if(this.canMove(downPosition,rock)){
                    currentSquare = downPosition
                }
                else {
                    break;
                }
            }

            this.paint(currentSquare,rock)

            let state = JSON.stringify([move,rocks.findIndex(r => r === rock)])

            for(let y = highest; y >= highest - 10; y--){
                let bitmap = ""
                for(let x = 0; x < 7; x++){
                    bitmap += this.board.has(JSON.stringify([y,x])) ? 1 : 0
                }
                state += parseInt(bitmap,2) + ','
            }


            if(states.has(state)){
                const prevState = states.get(state)!

                const heightDiff = this.getBoardHeight() - prevState!.height
                const pieceDiff = fallenRocks - prevState!.numPieces

                const rounds = Math.floor((maxFallen - prevState.numPieces) / pieceDiff) - 1

                if(rounds > 0){

                    extraHeight += rounds * heightDiff
                    fallenRocks += rounds * pieceDiff

                    console.log({highest,heightDiff,pieceDiff,fallenRocks,maxFallen,rounds,extraHeight})
                }
            }
            else{
                states.set(JSON.stringify(state),{
                    height: this.getBoardHeight(),
                    numPieces: fallenRocks
                })
            }

            fallenRocks++
        }

        //this.board.map(x => x.join('')).reverse().forEach(x => console.log(x))
        console.log(extraHeight)
        return extraHeight + this.getBoardHeight() + 1
    }
}

const solution: Problem<Movement[],number> = {
    getData(rawInput){
        return rawInput
            .split('\n')[0]
            .split('')
            .map(x => x === '>' ? 'right' : 'left')
    },

    solve1(moves){
        return new Tetris().play(moves,2022)
    },

    solve2(moves){
        return new Tetris().play(moves,1000000000000)
    },
}

export default wrapSolution(solution)