import { readFileSync } from 'fs'
import solution1 from './days/1'
import solution2 from './days/2'
import solution3 from './days/3'
import solution4 from './days/4'
import solution5 from './days/5'
import solution6 from './days/6'
import solution7 from './days/7'
import solution8 from './days/8'
import solution9 from './days/9'
import solution10 from './days/10'
import solution11 from './days/11'
import solution12 from './days/12'
import solution13 from './days/13'
import solution14 from './days/14'
import solution15 from './days/15'
import solution16 from './days/16'
import solution17 from './days/17'

const days = [
    solution1,
    solution2,
    solution3,
    solution4,
    solution5,
    solution6,
    solution7,
    solution8,
    solution9,
    solution10,
    solution11,
    solution12,
    solution13,
    solution14,
    solution15,
    solution16,
    solution17,
]

function execute(day: number, part = 1){
    const solution = days[day - 1]

    const data = readFileSync(`./input/${day}.txt`).toString()

    solution(data,part)
}

if(!process.argv[2]){
    throw new Error('which day lol?')
}

if(process.argv[2] === 'help'){
    console.log('... [day] [part]')
    process.exit(0)
}

execute(parseInt(process.argv[2]),process.argv[3] ? parseInt(process.argv[3]) : undefined)