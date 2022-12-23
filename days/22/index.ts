import { fold, mod, range, wrapSolution } from "../../lib/helper"
import Problem from "../../lib/problem"

type Trail = '#' | '.'

type Board = Map<number,Map<number,Trail>>
//////

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


/*  [((  r, 50,   left), (151 - r,       1, right)) | r <- [  1 ..  50]]
    [((  0,  c,     up), (100 + c,       1, right)) | c <- [ 51 .. 100]]
    [(( 51,  c,   down), ( c - 50,     100,  left)) | c <- [101 .. 150]]
    [((  r, 151, right), (151 - r,     100,  left)) | r <- [  1 ..  50]]

    [((  0,   c,    up), (    200, c - 100,    up)) | c <- [101 .. 150]]
    [((  r, 101, right), (     50, r +  50,    up)) | r <- [ 51 .. 100]]
    [((  r,  50,  left), (    101, r -  50,  down)) | r <- [ 51 .. 100]]
    [((  r,   0,  left), (151 - r,      51, right)) | r <- [101 .. 150]]

    [((100,   c,    up), ( 50 + c,      51, right)) | c <- [  1 ..  50]]
    [((  r, 101, right), (151 - r,     150,  left)) | r <- [101 .. 150]]
    [((151,   c,  down), (100 + c,      50,  left)) | c <- [ 51 .. 100]]
    [((  r,   0,  left), (      1, r - 100,  down)) | r <- [151 .. 200]]

    [((201,   c,  down), (      1, c + 100,  down)) | c <- [  1 ..  50]]
    [((  r,  51, right), (    150, r - 100,    up)) | r <- [151 .. 200]]*/

const wraps = [
    ...range(0,49).map(r => [[r,50,Facing.left],[100 + r,0,Facing.right]]),
    ...range(50,99).map(c => [[0,c,Facing.up],[100 + c,0,Facing.right]]),
    ...range(100,149).map(c => [[49,c,Facing.down],[c - 50,99,Facing.left]]),
    ...range(0,49).map(r => [[r,149,Facing.right],[150 - r,99,Facing.left]]),

    ...range(100,149).map(c => [[0,c,Facing.up],[199,c - 99,Facing.up]]),
    ...range(50,99).map(r => [[r,99,Facing.right],[49,r + 49,Facing.up]]),
    ...range(50,99).map(r => [[r,50,Facing.left],[100,r - 49,Facing.down]]),
    ...range(100,149).map(r => [[r,0,Facing.left],[150 - r, 50,Facing.right]]),

    ...range(0,50).map(c => [[100,c,Facing.up],[49 + c, 50,Facing.right]]),
    ...range(100,149).map(r => [[r,99,Facing.right],[149 - r, 149,Facing.left]]),
    ...range(50,99).map(c => [[149,c,Facing.down],[99 + c, 49,Facing.left]]),
    ...range(150,199).map(r => [[r,0,Facing.left],[0,r-100,Facing.down]]),

    ...range(0,49).map(c => [[199,c,Facing.down],[0,c+99,Facing.down]]),
    ...range(150,199).map(r => [[r,49,Facing.right],[149,r-99,Facing.up]]),

] as Array<[Player,Player]>

const cubeMover: Mover = (board,player) => {
    //console.log(player)
    console.log(board.get(player[0])!.get(player[1]))
    const opposite = wraps.find(w => w[0][0] === player[0] && w[0][1] === player[1] && player[2] === w[0][2])![1]

    return [opposite,board.get(opposite[0])!.get(opposite[1])!]
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

    console.log({player})

    const [nextStep,nextTrail] = goNext(board,mover,player)

    if(nextTrail === '#'){
        return player
    }

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

        return finalize(fold(
            operations.path,
            [init[0],init[1],Facing.right] as Player,
            (player,cur,index) => {
                if(cur.type === 'turn'){
                    player[2] = face(player[2],cur.turn)

                    return player
                }
                
                return advanceN(operations.board,cubeMover,player,cur.times)
        }))
    },
}

export default wrapSolution(solution)