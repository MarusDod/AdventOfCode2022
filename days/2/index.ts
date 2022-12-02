import { wrapSolution } from "../../lib/helper";
import Problem from "../../lib/problem";

import { match } from 'ts-pattern';

type Play = 'Rock' | 'Paper' | 'Scissors'
type Settlement = 'Win' | 'Draw' | 'Loss'

type PlayConverterFn = (x: string) => Play

const enemyPlayConverter: PlayConverterFn = (x) => {
        switch(x) {
            case 'A':
                return 'Rock'
            case 'B':
                return 'Paper'
            case 'C':
                return 'Scissors'
            default:
                throw new Error("invalid play")
        }
}

const myPlayConverter: PlayConverterFn = (x) => {
        switch(x) {
            case 'X':
                return 'Rock'
            case 'Y':
                return 'Paper'
            case 'Z':
                return 'Scissors'
            default:
                throw new Error("invalid play")
        }
}

const settlementConverter: (x: string) => Settlement = x => {
    switch(x) {
        case 'X': return 'Loss'
        case 'Y': return 'Draw'
        case 'Z': return 'Win'
        default:
            throw new Error('invalid settlement ' + x)
    }
}

const shapeScore: (x: Play) => 1 | 2 | 3 = (x) => {
    switch(x){
        case 'Rock': return 1
        case 'Paper': return 2
        case 'Scissors': return 3
    }
}

const fromSettlement: (x: Play,y: Settlement) => Play = (x,y) => {
    if(y == 'Draw')
        return x

    return match([x,y])
        .with(['Rock','Win'],() => 'Paper')
        .with(['Rock','Loss'],() => 'Scissors')
        .with(['Paper','Win'],() => 'Scissors')
        .with(['Paper','Loss'],() => 'Rock')
        .with(['Scissors','Win'],() => 'Rock')
        .with(['Scissors','Loss'],() => 'Paper')
        .otherwise(() => {
            throw new Error('aa')
        }) as Play
}

const settleWinner: (me: Play,enemy: Play) => number = (me,enemy) => {
    return match([me,enemy])
        .with(['Rock','Rock'],() => 3)
        .with(['Scissors','Scissors'],() => 3)
        .with(['Paper','Paper'],() => 3)
        .with(['Rock','Paper'],() => 0)
        .with(['Paper','Rock'],() => 6)
        .with(['Scissors','Paper'],() => 6)
        .with(['Paper','Scissors'],() => 0)
        .with(['Scissors','Rock'],() => 0)
        .with(['Rock','Scissors'],() => 6)
        .otherwise(() => {
            throw new Error('invalid play :(')
        })
}


const solution: Problem<Array<[string,string]>,number> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .filter(x => x.trim() != "")
            .map(x => x.split(' ') as [string,string])
    },

    solve1(rounds){
        return rounds
            .map(([x,y]) => [myPlayConverter(y),enemyPlayConverter(x)])
            .map(([me,enemy]) => settleWinner(me,enemy) + shapeScore(me))
            .reduce((prev,cur) => prev + cur,0)
    },

    solve2(rounds){
        return rounds
            .map(([enemy,settlement]) => [enemyPlayConverter(enemy),settlementConverter(settlement)] as [Play,Settlement])
            .map(([enemy,settlement]) => [fromSettlement(enemy,settlement),enemy])
            .map(([me,enemy]) => settleWinner(me,enemy) + shapeScore(me))
            .reduce((prev,cur) => prev + cur,0)
    }
}

export default wrapSolution(solution)