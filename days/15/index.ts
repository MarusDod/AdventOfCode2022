import { dropWhile, fold, iterate, nub, range, scanl, stagger, takeWhile, wrapSolution, zip } from "../../lib/helper"
import Problem from "../../lib/problem"

type Coordinate = {
    x: number,
    y: number,
}

type Sensor = {
    sensor: Coordinate,
    beacon: Coordinate,
    distance: number,
}

const decidingRow = 2000000

const solution: Problem<Sensor[],number> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => x.split(' '))
            .map(x => ({
                sensor: {
                    x: parseInt(x[2].slice(2,-1)),
                    y: parseInt(x[3].slice(2,-1)),
                },
                beacon: {
                    x: parseInt(x[8].slice(2,-1)),
                    y: parseInt(x[9].slice(2)),
                }
            }))
            .map(x => ({
                ...x,
                distance: Math.abs(x.sensor.x - x.beacon.x) + Math.abs(x.sensor.y - x.beacon.y)
            }))
    },

    solve1(sensors){

        const takenSquares: Set<number> = new Set(sensors
            .filter(s => s.sensor.y - s.distance <= decidingRow && s.sensor.y + s.distance >= decidingRow)
            .map(s => range(
                s.sensor.x - s.distance + Math.abs(decidingRow - s.sensor.y),
                s.sensor.x + s.distance - Math.abs(decidingRow - s.sensor.y))
                )
            .flat())

        let total = takenSquares.size

        takenSquares.forEach(x => sensors.some(s => s.beacon.y === decidingRow && s.beacon.x === x) ? --total : {})

        return total
    },

    solve2(sensors){
        const maxLen = 4000000
        const tuningFreq = 4000000

        for(const b of sensors){
            for(const [dirx,diry] of [[-1,-1],[1,1],[1,-1],[-1,1]]){
                for(const i of range(0,b.distance-1)){
                    const bx = (dirx * i) + b.sensor.x
                    const by = (diry * ((b.distance + 1) - i)) + b.sensor.y

                    if(bx < 0 || by < 0 || bx > maxLen || by > maxLen){
                        break;
                    }

                    if(sensors.every(s => (Math.abs(s.sensor.x - bx) + Math.abs(s.sensor.y - by)) > s.distance)){
                        return bx * tuningFreq + by
                    }
                }
                
            }
        }

        throw new Error('wtf')
    },
}

export default wrapSolution(solution)