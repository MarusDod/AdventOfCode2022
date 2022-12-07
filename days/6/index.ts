import { fold, wrapSolution } from "../../lib/helper"
import Problem from "../../lib/problem"

const solution: Problem<string,number> = {
    getData(rawInput){
        return rawInput
            .trim()
    },

    solve1(packet){
        const letters: string[] = []

        for (let i = 0;i < packet.length; i++){
            const cur = packet[i]

            letters.push(cur)

            if(letters.length === new Set(letters).size && letters.length == 4){
                return i + 1
            }


            if(letters.length == 4)
                letters.shift()
            
        }

        return -1
    },

    solve2(packet){
        const letters: string[] = []

        for (let i = 0;i < packet.length; i++){
            const cur = packet[i]

            letters.push(cur)

            if(letters.length === new Set(letters).size && letters.length == 14){
                return i + 1
            }


            if(letters.length == 14)
                letters.shift()
            
        }

        return -1
    }
}

export default wrapSolution(solution)