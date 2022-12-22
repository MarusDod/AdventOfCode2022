import { getRandomValues } from "crypto"
import { cycle, dropWhile, fold, includesAny, intersection, iterate, leftsection, maximum, minimum, nub, product, range, scanl, stagger, sum, takeWhile, wrapSolution, zip } from "../../lib/helper"
import Problem from "../../lib/problem"

type Material = 'ore' | 'clay' | 'geode' | 'obsidian'

type Cost = Record<Material,number>

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

class MineGeodes {
    initialRocks: Rocks;
    initialRobots: Robots;

    maxGeodes: number;
    maxOre: number;
    
    constructor(private blueprint: BluePrint,private maxMinutes: number) {
        this.maxGeodes = 0

        this.initialRobots = {
            oreCollectingRobots: 1,
            clayCollectingRobots: 0,
            obsidianCollectingRobots: 0,
            geodeCollectingRobots: 0
        }

        this.initialRocks = {
            ore: 0,
            clay: 0,
            obsidian: 0,
            geode: 0
        }

        this.maxOre = Math.max(
            blueprint.clayRobotCost['ore'],
            blueprint.geodeCost['ore'],
            blueprint.obsidianCost['ore'],
            blueprint.oreRobotCost['ore'],)
    }

    mine(): number{
        this.forkGeodes(1,this.initialRocks,this.initialRobots)

        console.log(this.maxGeodes)

        return this.maxGeodes
    }

    incrementRocks(rock: Rocks,robots: Robots): Rocks {
        return {
            ore: rock.ore + robots.oreCollectingRobots,
            clay: rock.clay + robots.clayCollectingRobots,
            obsidian: rock.obsidian + robots.obsidianCollectingRobots,
            geode: rock.geode + robots.geodeCollectingRobots
    }}

    forkGeodes(minutes: number,rocks: Rocks,robots: Robots): void {
        if(minutes === this.maxMinutes){
            this.maxGeodes = Math.max(this.maxGeodes,rocks.geode)
            return
        }

        const incRocks = this.incrementRocks(rocks,robots)

        const remaining = this.maxMinutes - minutes

        const nextGeodes = sum(Array.from(iterate((x => x+1),0,remaining))) + (remaining - 1) * robots.geodeCollectingRobots

        if(incRocks.geode + nextGeodes <= this.maxGeodes){
            return
        }


        const canBuildGeodeBot = rocks.ore >= this.blueprint.geodeCost['ore'] && rocks.obsidian >= this.blueprint.geodeCost['obsidian']
        const canBuildObsidianBot = rocks.ore >= this.blueprint.obsidianCost['ore'] && rocks.clay >= this.blueprint.obsidianCost['clay']
        const canBuildClayBot = rocks.ore >= this.blueprint.clayRobotCost['ore']
        const canBuildOreBot = rocks.ore >= this.blueprint.oreRobotCost['ore']

        const buildGeodeBot = () => 
                this.forkGeodes(minutes+1,{
                    ...incRocks,
                    ore: incRocks.ore - this.blueprint.geodeCost['ore'],
                    obsidian: incRocks.obsidian - this.blueprint.geodeCost['obsidian']
                },{
                    ...robots,
                    geodeCollectingRobots: robots.geodeCollectingRobots+1
                })

        const buildObsidianBot = () => 
                this.forkGeodes(minutes+1,{
                    ...incRocks,
                    ore: incRocks.ore - this.blueprint.obsidianCost['ore'],
                    clay: incRocks.clay - this.blueprint.obsidianCost['clay']
                },{
                    ...robots,
                    obsidianCollectingRobots: robots.obsidianCollectingRobots+1
                })

        const buildNothing = () => 
            this.forkGeodes(minutes+1,{...incRocks},{...robots})

        const buildClayBot = () => 
                this.forkGeodes(minutes+1,{
                    ...incRocks,
                    ore: incRocks.ore - this.blueprint.clayRobotCost['ore'],
                },{
                    ...robots,
                    clayCollectingRobots: robots.clayCollectingRobots+1
                })
        const buildOreBot = () => 
                this.forkGeodes(minutes+1,{
                    ...incRocks,
                    ore: incRocks.ore - this.blueprint.oreRobotCost['ore'],
                },{
                    ...robots,
                    oreCollectingRobots: robots.oreCollectingRobots+1
                })

        if(canBuildGeodeBot){
            buildGeodeBot()
            return
        }
        if(canBuildObsidianBot && this.blueprint.geodeCost['obsidian'] > robots.obsidianCollectingRobots){
            buildObsidianBot()
        }
        if(canBuildClayBot && this.blueprint.obsidianCost['clay'] > robots.clayCollectingRobots){
            buildClayBot()
        }
        if(canBuildOreBot && robots.oreCollectingRobots < this.maxOre){
            buildOreBot()
        }
        
        buildNothing()
    }
}



const solution: Problem<BluePrint[],number> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => x.split(' '))
            .map(x => ({
                oreRobotCost:  {ore: parseInt(x[6])},
                clayRobotCost: {ore: parseInt(x[12])},
                obsidianCost: {ore: parseInt(x[18]),clay: parseInt(x[21])},
                geodeCost: {ore: parseInt(x[27]),obsidian: parseInt(x[30])},
            }) as BluePrint)
    },

    solve1(prints){
        return sum(
            zip(
                range(1,prints.length),
                prints.map(p => new MineGeodes(p,25).mine()))
            .map(([i,n]) => i*n))
    },

    solve2(prints){
        return product(prints
            .slice(0,3)
            .map(p => new MineGeodes(p,33).mine()))
    },
}

export default wrapSolution(solution)