import { dropWhile, fold, iterate, nub, range, scanl, stagger, takeWhile, wrapSolution, zip } from "../../lib/helper"
import Problem from "../../lib/problem"

type Point = {
    x: number,
    y: number,
}

type PointType = '#' | '.' | 'o'

type Board = PointType[][]

function prettyPrintBoard(board: Board,minX: number,maxX: number) : void {

    board.forEach(b => console.log('|',b.slice(minX,maxX+1).join(''),'|'))
}

function pourSand(startingPoint: Point,board: Board,minX:number,maxX:number): Point | undefined {
    let current: Point = {...startingPoint}

    while(true){
        if(current.x < minX || current.x > maxX){
            return undefined
        }

        if(board[current.y + 1][current.x] === '.'){
            current.y++;
        }
        else if(board[current.y + 1][current.x-1] === '.'){
            current.y++;
            current.x--;
        }
        else if(board[current.y + 1][current.x+1] === '.'){
            current.y++;
            current.x++;
        }
        else {
            return current
        }
    }


    return undefined
}

function pourSandv2(startingPoint: Point,board: Board): Point | undefined {
    let current: Point = {...startingPoint}

    if(board[startingPoint.y][startingPoint.x] === 'o'){
        return undefined
    }

    while(true){
        if(board[current.y + 1][current.x] === '.'){
            current.y++;
        }
        else if(board[current.y + 1][current.x-1] === '.'){
            current.y++;
            current.x--;
        }
        else if(board[current.y + 1][current.x+1] === '.'){
            current.y++;
            current.x++;
        }
        else {
            return current
        }
    }


    return undefined
}

const solution: Problem<{board: Board,minX: number,maxX:number},number> = {
    getData(rawInput){
        const points: Point[]  = rawInput
            .slice(0,-1)
            .split('\n')
            .map(x => x
                .split(' -> ')
                .map(y => {
                    const pair = y
                        .split(',')
                        .map(z => parseInt(z))

                    return {
                        x: pair[0],
                        y: pair[1],
                    } as Point
                }))
            .map(pairs => 
                stagger(pairs).map(([prev,cur]) =>
                    zip(
                        range(prev.x,cur.x),
                        range(prev.y,cur.y),
                        false)
                    .map(([x,y]) => ({x,y}) as Point)
                )
            )
            .flat(3)

        const maxX = points.reduce((prev,cur) => prev.x > cur.x ? prev : cur).x
        const maxY = points.reduce((prev,cur) => prev.y > cur.y ? prev : cur).y
        const minX = points.reduce((prev,cur) => prev.x < cur.x ? prev : cur).x

        const board: Board = Array.from({length: maxY+3},() => 
                Array.from({length: maxX+maxY+3},() => '.'))

        points.forEach(p => board[p.y][p.x] = '#')

        board.at(-1)!.forEach((_,i,arr) => arr[i] = '#')

        return {board,minX,maxX}
    },

    solve1({board,minX,maxX}){

        const start: Point = {
            x: 500,
            y: 0,
        }

        let newPoint: Point | undefined = undefined

        while(newPoint = pourSand(start,board,minX,maxX)){
            board[newPoint!.y][newPoint!.x] = 'o'
        }

        return fold(
            board,
            0,
            (prev,cur) => prev + fold(
                cur,
                0,
                (prev,cur) => cur === 'o' ? prev + 1 : prev))
    },

    solve2({board,minX,maxX}){
        const start: Point = {
            x: 500,
            y: 0,
        }

        let newPoint: Point | undefined = undefined

        while(newPoint = pourSandv2(start,board)){
            board[newPoint!.y][newPoint!.x] = 'o'
        }

        return fold(
            board,
            0,
            (prev,cur) => prev + fold(
                cur,
                0,
                (prev,cur) => cur === 'o' ? prev + 1 : prev))
    },
}

export default wrapSolution(solution)