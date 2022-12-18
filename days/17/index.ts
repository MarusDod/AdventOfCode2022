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
    private board: Unit[][]
    private extraHeight: number

    constructor(){
        this.board = Array.from({length: 1_010_000},
            () => Array.from({length: 7},
                () => '.'))

        this.extraHeight = 0
    }

    canMove(square: Square,rock: Rock): boolean {
        if(square[1] < 0 || square[1] >= 7 || square[0] < 0){
            return false
        }

        for(let i = 0;i < rock.length; i++){
            for(let j = 0;j < rock[0].length; j++){
                if((this.board[square[0] + i - this.extraHeight][square[1] + j] === '#' || this.board[square[0] + i - this.extraHeight][square[1] + j] === '@') && rock[i][j] === '#' || j + square[1] >= 7){
                    return false
                }
            }
        }

        return true
    }

    paint(square: Square, rock: Rock): number {
        let high = 0


        for(let i = 0;i < rock.length; i++){
            for(let j = 0;j < rock[0].length; j++){
                if(rock[i][j] === '#'){
                    this.board[square[0] + i - this.extraHeight][square[1] + j] = '@'

                    high = i
                }
            }
        }

        return high + square[0]
    }

    play(moves: Movement[],maxFallen: number){
        let currentSquare: Square = [4,2]
        let highest = 0

        let rocksIter = cycle(rocks)
        let movesIter = cycle(moves)
        let fallenRocks = 0

        let rock: Rock = rocksIter.next().value

        while(fallenRocks < maxFallen){
            const downPosition = moveSquare('down',currentSquare)

            if(this.canMove(downPosition,rock)){
                currentSquare = downPosition
            }
            else {
                const high = this.paint(currentSquare,rock)

                if(high > highest)
                    highest = high

                currentSquare = [highest + 4,2]
                fallenRocks++

                if(fallenRocks % 1_000_000 === 0)
                    console.log(fallenRocks)

                if(highest - this.extraHeight > 1_001_000){
                    this.board = this.board.slice(1_000_000).concat(
                        Array.from({length: 1_000_000},
                            () => Array.from({length: 7},
                                () => '.')))

                    this.extraHeight += 1_000_000
                }

                rock = rocksIter.next().value
            }

            const move: Movement = movesIter.next().value

            const jetPosition = moveSquare(move,currentSquare)

            if(this.canMove(jetPosition,rock)) {
                currentSquare = jetPosition
            }

        }

        //this.board.map(x => x.join('')).reverse().forEach(x => console.log(x))
        return highest + 1
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
        return new Tetris().play(moves,2023)
    },

    solve2(moves){
        return new Tetris().play(moves,1000000000000)
    },
}

export default wrapSolution(solution)