import { fold, iterate, scanl, takeWhile, wrapSolution } from "../../lib/helper"
import Problem from "../../lib/problem"

type Monkey = {
    items: number[],
    inspected: number,
    operation: (x: number) => number,
    div: number,
    test: (x: number) => number,
}


const monkeyBusiness = (monkeys: Monkey[],worried: boolean = false): Monkey[] => {
    monkeys.forEach(m => {
        m.items = m.items.map(i => m.operation(i))
        m.inspected += m.items.length

        if(!worried)
            m.items = m.items.map(i => Math.floor(i / 3))

        m.items.forEach(i => monkeys[m.test(i)].items.push(i))

        m.items = []
    })

    return monkeys
}

const solution: Problem<Monkey[],number> = {
    getData(rawInput){
        return rawInput
            .split('\n\n')
            .map(x => {
                const lines = x.split('\n')

                const items = lines[1].split(' ').slice(4).map(y => parseInt(y.replace(',','')))
                const ops = lines[2].split(' ').slice(6)

                const op: (x:number,y:number) => number = ops[0] === '*' ? ((x,y) => x*y) : ((x,y) => x+y)

                const operation = (x: number) => op(x, ops[1] === 'old' ? x : parseInt(ops[1]))

                const testNum = parseInt(lines[3].split(' ')[5])
                const monkey1 = parseInt(lines[4].split(' ')[9])
                const monkey2 = parseInt(lines[5].split(' ')[9])


                const test = x => x % testNum === 0 ? monkey1 : monkey2

                return {
                    items,
                    inspected: 0,
                    operation,
                    div: testNum,
                    test
                } as Monkey
            })
    },

    solve1(monkeys){
        const iter = iterate(monkeyBusiness,monkeys,20)

        while(!iter.next().done){}

        return monkeys
            .map(x => x.inspected)
            .sort((x,y) => x < y ? -1 : x==y ? 0 : 1)
            .slice(-2)
            .reduce((prev,cur) => prev * cur,1)
    },

    solve2(monkeys){
        const lcm = monkeys.reduce((prev,cur) => prev * cur.div,1)
        const iter = iterate(monkeys => monkeyBusiness(monkeys,true),monkeys,10000)

        while(!iter.next().done){
            monkeys.forEach(m => m.items = m.items.map(i => i % lcm))
        }

        return monkeys
            .map(x => x.inspected)
            .sort((x,y) => x < y ? -1 : x==y ? 0 : 1)
            .slice(-2)
            .reduce((prev,cur) => prev * cur,1)
    },
}

export default wrapSolution(solution)