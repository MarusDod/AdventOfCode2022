import { fold, takeWhile, wrapSolution } from "../../lib/helper"
import Problem from "../../lib/problem"

type Direction = 'U' | 'R' | 'L' | 'D'

type Move = {
    direction: Direction,
    times: number,
}

type Coordinate = {
    x: number,
    y: number,
}

type FixedArray<T,N extends number> = Array<T> & {
    0: T,
    readonly length: N
}

type PositionState<T extends number> = {
    visited: Set<string>
    head: Coordinate,
    tail: T extends 1 ? Coordinate : FixedArray<Coordinate,9>,
}

const planktonLength = (head: Coordinate,tail: Coordinate): [number,number] => {
    return [head.x - tail.x,head.y - tail.y]
}

const movePosition = (prev: PositionState<1>,move: Direction): PositionState<1> => {
    //console.log(prev.head,prev.tail,move)

    switch(move){
        case 'D':
            prev.head.y -= 1
            break;
        case 'R':
            prev.head.x += 1
            break;
        case 'L':
            prev.head.x -= 1
            break;
        case 'U':
            prev.head.y += 1
            break;
    }


    const [diffX,diffY] = planktonLength(prev.head,prev.tail)

    if(Math.abs(diffX) === 2) {
        prev.tail.x += diffX / 2
        prev.tail.y = prev.head.y
    }

    else if(Math.abs(diffY) === 2) {
        prev.tail.y += diffY / 2
        prev.tail.x = prev.head.x
    }

    prev.visited.add(JSON.stringify(prev.tail   ))

    return prev
}

const movePositionV2 = (prev: PositionState<9>,move: Direction): PositionState<9> => {
    //console.log(prev.head,prev.tail,move)
    switch(move){
        case 'D':
            prev.head.y -= 1
            break;
        case 'R':
            prev.head.x += 1
            break;
        case 'L':
            prev.head.x -= 1
            break;
        case 'U':
            prev.head.y += 1
            break;
    }


    [prev.head]
        .concat(prev.tail)
        .reduce((head,tail) => {
            const [diffX,diffY] = planktonLength(head,tail)
            //console.log([diffX,diffY,head,tail])

            if(Math.abs(diffX) === 2 && Math.abs(diffY) === 2) {
                tail.x += diffX / 2
                tail.y += diffY / 2
            }

            else if(Math.abs(diffX) === 2) {
                tail.x += diffX / 2
                tail.y = head.y
            }

            else if(Math.abs(diffY) === 2) {
                tail.y += diffY / 2
                tail.x = head.x
            }

            return tail
        })

    prev.visited.add(JSON.stringify(prev.tail[8]))

    return prev
}

const solution: Problem<Move[],number> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => {
                const s = x.split(' ')

                return {
                    direction: s[0] as Direction,
                    times: parseInt(s[1])
                }
            })
    },

    solve1(moves){
        const initPosition: PositionState<1> = {
            visited: new Set(),

            head: {
                x: 0,
                y: 0,
            },
            tail: {
                x: 0,
                y: 0,
            }
        }

        return fold(moves
            .flatMap(m => Array(m.times).fill(m.direction) as Direction[]),
                initPosition,movePosition)
            .visited.size
    },

    solve2(moves){
        const initPosition: PositionState<9> = {
            visited: new Set(),

            head: {
                x: 0,
                y: 0,
            },
            tail: Array.from({length: 9},() => ({
                x: 0,
                y: 0,
            })) as FixedArray<Coordinate,9>
        }

        return fold(moves
            .flatMap(m => Array(m.times).fill(m.direction) as Direction[]),
                initPosition,movePositionV2)
            .visited.size

        return 0
    },
}

export default wrapSolution(solution)