import { fold, mod, range, wrapSolution } from "../../lib/helper"
import Problem from "../../lib/problem"

type Trail = '#' | '.'

type Board = Map<number,Map<number,Trail>>

type Turn = 'L' | 'R'

enum Facing {
    right = 0,
    down = 1,
    left = 2,
    up = 3,
}

type Direction = {
    type: 'turn',
    turn: Turn
} | 
{
    type: 'forward',
    times: number
}

type Coordinate = [number,number]

type Player = [...Coordinate,Facing]

type Mover = (board: Board,player: Player) => [Player,Trail]


const face = (facing: Facing,turn: Turn): Facing =>
    (turn === 'L' ? mod(facing-1,4) : mod(facing+1,4)) as Facing

const getRow = (board: Board,r: number): [Coordinate,Trail][] => 
    Array.from(board.get(r)!.entries()).map(b => [[r,b[0]],b[1]])

const getCol = (board: Board,c: number): [Coordinate,Trail][] => {
    const res: [Coordinate,Trail][] = []

    for(let [index,row] of board.entries()){
        if(row.get(c)){
            res.push([[index,c],row.get(c)!])
        }
    }

    return res
}

const findMinimumRow = (board: Board,r: number): [Coordinate,Trail] =>
    getRow(board,r).reduce((prev,cur) => prev[0][1] < cur[0][1] ? prev : cur)

const findMaximumRow = (board: Board,r: number): [Coordinate,Trail] =>
    getRow(board,r).reduce((prev,cur) => prev[0][1] > cur[0][1] ? prev : cur)

const findMinimumColumn = (board: Board,r: number): [Coordinate,Trail] =>
    getCol(board,r).reduce((prev,cur) => prev[0][0] < cur[0][0] ? prev : cur)

const findMaximumColumn = (board: Board,r: number): [Coordinate,Trail] =>
    getCol(board,r).reduce((prev,cur) => prev[0][0] > cur[0][0] ? prev : cur)



const squareSize = 49

const whichSquare = (c: Coordinate): number => Math.floor(c[0] / 50) * 3 + Math.floor(c[1] / 50) + 1

const squareCoordinates = (s: number): Coordinate => [Math.floor((s - 1) / 3) * 50,Math.floor((s - 1) % 3) * 50]

const relCoordinates = (from: Coordinate,coord: Coordinate): Coordinate => 
    [Math.abs(from[0] - coord[0]),Math.abs(from[1] - coord[1])]

const sumCoordinates = (from: Coordinate,coord: Coordinate): Coordinate => 
    [from[0] + coord[0],from[1] + coord[1]]

const adjSquares: Array<[[number,Facing],[number,Facing]]> = [
    [[3,Facing.down],[5,Facing.left]],
    [[5,Facing.right],[3,Facing.up]],

    [[5,Facing.left],[7,Facing.down]],
    [[7,Facing.up],[5,Facing.right]],

    [[8,Facing.down],[10,Facing.left]],
    [[10,Facing.right],[8,Facing.up]],

    [[2,Facing.left],[7,Facing.right]],
    [[7,Facing.left],[2,Facing.right]],

    [[2,Facing.up],[10,Facing.right]],
    [[10,Facing.left],[2,Facing.down]],

    [[3,Facing.up],[10,Facing.up]],
    [[10,Facing.down],[3,Facing.down]],

    [[8,Facing.right],[3,Facing.left]],
    [[3,Facing.right],[8,Facing.left]],
]

const rotate = (f: Facing,g: Facing,relCoord: Coordinate): Coordinate => {
    if(f === Facing.up && g === Facing.up)
        return [squareSize,relCoord[1]]
    else if(f === Facing.right && g === Facing.up)
        return [squareSize,relCoord[0]]
    else if(f === Facing.left && g === Facing.down)
        return [0,relCoord[0]]
    else if(f === Facing.up && g === Facing.right)
        return [relCoord[1],0]
    else if(f === Facing.down && g === Facing.left)
        return [relCoord[1],squareSize]
    else if(f === Facing.right && g === Facing.up)
        return [squareSize,relCoord[0]]
    else if(f === Facing.left && g === Facing.right)
        return [squareSize - relCoord[0],0]
    else if(f === Facing.down && g === Facing.down)
        return [0,relCoord[1]]
    else if(f === Facing.right && g === Facing.left)
        return [squareSize - relCoord[0],squareSize]

    throw new Error('unreachable')
}

const cubeMover: Mover = (board,player) => {
    const coord: Coordinate = [player[0],player[1]]
    const cur = board.get(player[0])!.get(player[1])

    if(!cur){
        throw new Error('nop')
    }

    const square = whichSquare(coord)
    const squareCoord = squareCoordinates(square)

    const opposite = adjSquares.find(a => a[0][0] === square && player[2] === a[0][1])![1]
    const oppositeCoord = squareCoordinates(opposite[0])

    const finalCoord = sumCoordinates(oppositeCoord,rotate(player[2],opposite[1],relCoordinates(squareCoord,coord)))

    console.log({coord,square,finalCoord,oppositeSquare:opposite[0]})

    return [[...finalCoord,opposite[1]],board.get(finalCoord[0])!.get(finalCoord[1])!]
}

const linearMover: Mover = (board,player) => {
    var coords: [Coordinate,Trail]

    switch(player[2]){
        case Facing.right: 
            coords = findMinimumRow(board,player[0])
            break;
        case Facing.left:
            coords = findMaximumRow(board,player[0])
            break;
        case Facing.down:
            coords = findMinimumColumn(board,player[1])
            break;
        case Facing.up:
            coords = findMaximumColumn(board,player[1])
            break;
    }

    return [[...coords[0],player[2]],coords[1]]
}

const goNext = (board: Board,mover: Mover,player: Player): [Player,Trail] => {
    const next = [[0,1],[1,0],[0,-1],[-1,0]][player[2]] as Coordinate

    const nextStep = [next[0] + player[0],next[1] + player[1]]

    let nextTrail = board.get(nextStep[0])?.get(nextStep[1])

    if(!nextTrail)
        return mover(board,player)

    return [[nextStep[0],nextStep[1],player[2]],nextTrail]
}

const advanceN = (board: Board,mover: Mover,player: Player,times: number): Player => {
    if(times === 0)
        return player

    const [nextStep,nextTrail] = goNext(board,mover,player)

    if(nextTrail === '#'){
        return player
    }

    console.log(nextStep)
    
    return advanceN(board,mover,nextStep,times-1)
}

const finalize = (player: Player): number => 
    ((player[0] + 1) * 1000) + ((player[1] + 1) * 4) + player[2]


const solution: Problem<{board: Board,path: Direction[]},number> = {
    getData(rawInput){
        const q = rawInput
            .split('\n\n')

        return {
            board:
                new Map(q[0]
                    .split('\n')
                    .map((w,index) => 
                        [index,new Map(w
                            .split('')
                            .map((x,index) => [index,x] as [number,string])
                            .filter(x => x[1] !== ' ')) as Map<number,Trail>])),
            path: q[1].trim()
                .match(/[a-zA-Z]+|[0-9]+/g)!
                .map(x => isNaN(parseInt(x)) ? ({
                    type: 'turn',
                    turn: x as Turn
                }) : {
                    type: 'forward',
                    times: parseInt(x)
                })
        }
    },

    solve1(operations){
        const init: Coordinate = findMinimumRow(operations.board,0)[0]

        return finalize(fold(
            operations.path,
            [init[0],init[1],Facing.right] as Player,
            (player,cur) => {
                if(cur.type === 'turn'){
                    player[2] = face(player[2],cur.turn)

                    return player
                }
                
                return advanceN(operations.board,linearMover,player,cur.times)
        }))
    },

    solve2(operations){
        const init: Coordinate = findMinimumRow(operations.board,0)[0]

        const a = finalize(fold(
            operations.path,
            [init[0],init[1],Facing.right] as Player,
            (player,cur,index) => {
                if(cur.type === 'turn'){
                    player[2] = face(player[2],cur.turn)

                    return player
                }
                
                return advanceN(operations.board,cubeMover,player,cur.times)
        }))

        return a
    },
}

export default wrapSolution(solution)