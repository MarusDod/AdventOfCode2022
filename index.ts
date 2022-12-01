import { readFileSync } from 'fs'
import solution1 from './days/1'

const days = [
    solution1
]

function execute(day: number, part: number = 1){
    const solution = days[day - 1]

    const data = solution.getData(readFileSync(`./input/${day}.txt`).toString())

    switch(part){
        case 1:
            console.log(solution.solve1(data))
            break;
        case 2:
            console.log(solution.solve2(data))
            break;
    }
}

if(!process.argv[1]){
    throw new Error('which day lol?')
}

execute(parseInt(process.argv[2]),process.argv[3] ? parseInt(process.argv[3]) : undefined)