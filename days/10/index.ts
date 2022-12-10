import { fold, scanl, takeWhile, wrapSolution } from "../../lib/helper"
import Problem from "../../lib/problem"

type AddX = {
    type: 'Add'
    arg: number
}

type Noop = {
    type: 'Noop'
}

type Instruction = AddX | Noop

type CpuState = {
    cycle: number,
    X: number
}

const solution: Problem<Instruction[],number> = {
    getData(rawInput){
        return (rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => {
                const sp = x.split(' ')
                switch(sp[0]){
                    case 'addx':
                        return {
                            type: 'Add',
                            arg: parseInt(sp[1])
                        }
                    case 'noop':
                        return {
                            type: 'Noop',
                        }
                    default:
                        throw new Error('wtf')
                }
            }) as Instruction[])
            .flatMap(i => i.type === 'Add' ? [{type: 'Noop'},i]: [i])

    },

    solve1(ins){
        const baseCpuState: CpuState = {
            cycle: 1,
            X: 1,
        }

        const cycles = scanl(ins,
            baseCpuState,(prev,cur) => {
            switch(cur.type){
                case 'Add':
                    const adder = cur as AddX

                    return {
                        cycle: prev.cycle+1,
                        X: prev.X + adder.arg,
                    }
                case 'Noop':
                    const nooper = cur as Noop

                    return {
                        ...prev,
                        cycle: prev.cycle+1,
                    }
                default:
                    throw new Error('wtf')
            }
        })

        return cycles
            .filter(c => [20,60,100,140,180,220].includes(c.cycle))
            .map(c => ({
                ...c,
                signalStrength: c.X * c.cycle

            }) as CpuState & {signalStrength: number})
            .map(c => c.signalStrength)
            .reduce((prev,cur) => prev + cur,0)
    },

    solve2(ins){
        const baseCpuState: CpuState = {
            cycle: 1,
            X: 1,
        }

        const matrix: Array<string> = Array.from({length: 240},() => '.')

        fold(ins,baseCpuState,(cpu,cur) => {
            const hor = ((cpu.cycle - 1) % 40) 

            if(cpu.X >= hor -1 && cpu.X <= hor + 1){
                matrix[cpu.cycle - 1] = '#'
            }

            switch(cur.type){
                case 'Add':
                    const adder = cur as AddX

                    return {
                        cycle: cpu.cycle+1,
                        X: cpu.X + adder.arg,
                    }
                case 'Noop':
                    const nooper = cur as Noop

                    return {
                        ...cpu,
                        cycle: cpu.cycle+1,
                    }
                default:
                    throw new Error('wtf')
            }
        })

        const res: Array<Array<string>> = []

        while(matrix.length > 0){
            res.push(matrix.splice(0,40))
        }

        res.forEach(res => console.log(res.join('')))

        return 0
    },
}

export default wrapSolution(solution)