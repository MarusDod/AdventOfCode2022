import { getRandomValues } from "crypto"
import { cycle, dropWhile, fold, includesAny, intersection, iterate, leftsection, maximum, minimum, nub, range, scanl, stagger, sum, takeWhile, wrapSolution, zip } from "../../lib/helper"
import Problem from "../../lib/problem"

type Cube = [number,number,number]


const isInVinicity = (c: Cube,b: Cube): boolean => 
    (c[0] === b[0] && c[1] === b[1] && Math.abs(c[2] - b[2]) === 1)
    || (c[0] === b[0] && c[2] === b[2] && Math.abs(c[1] - b[1]) === 1)
    || (c[1] === b[1] && c[2] === b[2] && Math.abs(c[0] - b[0]) === 1)

const cubeComparator = (x: Cube,y: Cube): boolean => 
    x[0] === y[0] && x[1] === y[1] && x[2] === y[2]

const getNeighbours = (cubes: Cube[],start: Cube): Cube[] => {
    const queue: Cube[] = [start]

    while(queue.length > 0){
        const cube: Cube = queue.shift()!

        const allNeighbours: Cube[] = [[-1,0,0],[1,0,0],[0,-1,0],[0,1,0],[0,0,-1],[0,0,1]]
                .map(q => [cube[0] + q[0],cube[1] + q[1],cube[2] + q[2]])

        const neighbours = intersection(allNeighbours,cubes,cubeComparator)

        cubes = leftsection(cubes,neighbours,cubeComparator)
        queue.push(...neighbours)
    }

    return cubes
}

const surfaceArea = (cubes: Cube[]): number => 
    (6 * cubes.length) - sum(cubes
        .map(cube => cubes.reduce((prev,cur) => isInVinicity(cube,cur) ? prev+1 : prev,0)))

const solution: Problem<Cube[],number> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => x.split(',').map(y => parseInt(y)) as Cube)
    },

    solve1(cubes){
        return surfaceArea(cubes)
    },

    solve2(cubes){
        const minX = cubes.map(c => c[0]).reduce((prev,cur) => cur < prev ? cur : prev,Number.MAX_SAFE_INTEGER)
        const maxX = cubes.map(c => c[0]).reduce((prev,cur) => cur > prev ? cur : prev,0)
        const minY = cubes.map(c => c[1]).reduce((prev,cur) => cur < prev ? cur : prev,Number.MAX_SAFE_INTEGER)
        const maxY = cubes.map(c => c[1]).reduce((prev,cur) => cur > prev ? cur : prev,0)
        const minZ = cubes.map(c => c[2]).reduce((prev,cur) => cur < prev ? cur : prev,Number.MAX_SAFE_INTEGER)
        const maxZ = cubes.map(c => c[2]).reduce((prev,cur) => cur > prev ? cur : prev,0)

        let allCubes: Cube[] = []

        for(let i = minX - 1; i <= maxX + 1;i++){
            for(let j = minY - 1; j <= maxY + 1;j++){
                for(let k = minZ - 1; k <= maxZ + 1;k++){
                    allCubes.push([i,j,k])
                }
            }
        }

        const airCubes = leftsection(allCubes,cubes,cubeComparator)

        const start: Cube = airCubes.shift()!

        const innerCubes = getNeighbours(airCubes,start)


        return  surfaceArea(cubes) - surfaceArea(innerCubes)
    },
}

export default wrapSolution(solution)