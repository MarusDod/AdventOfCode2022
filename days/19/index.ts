import { getRandomValues } from "crypto"
import { cycle, dropWhile, fold, includesAny, intersection, iterate, leftsection, maximum, minimum, nub, range, scanl, stagger, sum, takeWhile, wrapSolution, zip } from "../../lib/helper"
import Problem from "../../lib/problem"

type Material = 'ore' | 'clay' | 'geode' | 'obsidian'

type Cost = Array<{
    material: Material,
    n: number
}>

type BluePrint = {
    index: number,
    oreRobotCost: Cost,
    clayRobotCost: Cost,
    obsidianCost: Cost,
    geodeCost: Cost,
}

type Robots = {
    oreCollectingRobots: number
    clayCollectingRobots: number
    obsidianCollectingRobots: number
    geodeCollectingRobots: number
}

type Rocks = {
    ore: number,
    clay: number,
    obsidian: number,
    geode: number,
}

let maxGeodes = 0

function mineGeodes(print: BluePrint) : number {
    maxGeodes = 0

    forkGeodes(print,1,{
        ore: 0,
        clay: 0,
        obsidian: 0,
        geode: 0
    },{
        oreCollectingRobots: 1,
        clayCollectingRobots: 0,
        obsidianCollectingRobots: 0,
        geodeCollectingRobots: 0
    },[])

    console.log(maxGeodes)

    return maxGeodes * print.index
}

const incrementRocks = (rock: Rocks,robots: Robots): Rocks => ({
    ore: rock.ore + robots.oreCollectingRobots,
    clay: rock.clay + robots.clayCollectingRobots,
    obsidian: rock.obsidian + robots.obsidianCollectingRobots,
    geode: rock.geode + robots.geodeCollectingRobots
})

function forkGeodes(print: BluePrint,minutes: number,rocks: Rocks,robots: Robots,path: string[]): void {
    if(minutes === 25){
        maxGeodes = Math.max(maxGeodes,rocks.geode)
        return
    }

    const incRocks = incrementRocks(rocks,robots)

    const canBuildGeodeBot = rocks.ore >= print.geodeCost[0].n && rocks.obsidian >= print.geodeCost[1].n
    const canBuildObsidianBot = rocks.ore >= print.obsidianCost[0].n && rocks.clay >= print.obsidianCost[1].n
    const canBuildClayBot = rocks.ore >= print.clayRobotCost[0].n
    const canBuildOreBot = rocks.ore >= print.oreRobotCost[0].n

    const buildGeodeBot = () => 
            forkGeodes(print,minutes+1,{
                ...incRocks,
                ore: incRocks.ore - print.geodeCost[0].n,
                obsidian: incRocks.obsidian - print.geodeCost[1].n
            },{
                ...robots,
                geodeCollectingRobots: robots.geodeCollectingRobots+1
            },[...path,'G'])

    const buildObsidianBot = () => 
            forkGeodes(print,minutes+1,{
                ...incRocks,
                ore: incRocks.ore - print.obsidianCost[0].n,
                clay: incRocks.clay - print.obsidianCost[1].n
            },{
                ...robots,
                obsidianCollectingRobots: robots.obsidianCollectingRobots+1
            },[...path,'O'])

    const buildClayBot = () => 
            forkGeodes(print,minutes+1,{
                ...incRocks,
                ore: incRocks.ore - print.clayRobotCost[0].n,
            },{
                ...robots,
                clayCollectingRobots: robots.clayCollectingRobots+1
            },[...path,'C'])
    const buildOreBot = () => 
            forkGeodes(print,minutes+1,{
                ...incRocks,
                ore: incRocks.ore - print.oreRobotCost[0].n,
            },{
                ...robots,
                oreCollectingRobots: robots.oreCollectingRobots+1
            },[...path,'R'])

    if(canBuildGeodeBot){
        buildGeodeBot()
    }

    if(canBuildObsidianBot){
        buildObsidianBot()
    }
    if(canBuildClayBot && rocks.clay < print.obsidianCost[1].n){
        buildClayBot()
    }
    if(canBuildOreBot && ( rocks.ore < print.obsidianCost[0].n || rocks.ore < print.geodeCost[0].n)){
        buildOreBot()
    }
    else
        forkGeodes(print,minutes+1,{...incRocks},{...robots},[...path,'N'])
}

const solution: Problem<BluePrint[],number> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => x.split(' '))
            .map(x => ({
                index: parseInt(x[1].replace('\:','')),
                oreRobotCost:  [{material: 'ore',n: parseInt(x[6])}],
                clayRobotCost: [{material: 'ore',n: parseInt(x[12])}],
                obsidianCost: [{material: 'ore',n: parseInt(x[18])},{material: 'clay',n: parseInt(x[21])}],
                geodeCost: [{material: 'ore',n: parseInt(x[27])},{material: 'obsidian',n: parseInt(x[30])}],
            }))
    },

    solve1(prints){
        return sum(prints
            .map(p => mineGeodes(p)))
    },

    solve2(prints){
        return 0
    },
}

export default wrapSolution(solution)