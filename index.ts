import { readFileSync } from 'fs'
import solution1 from './days/1'
import solution2 from './days/2'
import solution3 from './days/3'

const days = [
    solution1,
    solution2,
    solution3,
]

function execute(day: number, part: number = 1){
    const solution = days[day - 1]

    const data = readFileSync(`./input/${day}.txt`).toString()

    solution(data,part)
}

if(!process.argv[1]){
    throw new Error('which day lol?')
}

execute(parseInt(process.argv[2]),process.argv[3] ? parseInt(process.argv[3]) : undefined)