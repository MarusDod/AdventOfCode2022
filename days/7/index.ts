import { fold, wrapSolution } from "../../lib/helper"
import Problem from "../../lib/problem"

type LsOutput =
{
    type: 'ls',
}

type CdOutput =
{
    type: 'cd',
    arg: string
}

type DirOutput =
{
    type: 'dir',
    dirname: string
}

type FileOutput =
{
    type: 'file',
    size: number,
    filename: string,
}

type Output = LsOutput | CdOutput | DirOutput | FileOutput

type Dir = {
    type: 'dir',
    name: string,
    files: FileTree[]
}

type File = 
{
    type: 'file',
    name: string,
    size: number
}

type FileTree = Dir | File

type DirSizeTree = {
    name: string,
    size: number,
    subDirs: DirSizeTree[]
}

type ProgramState = {
    lines: Output[],
    tree: FileTree,
    currentPath: string[]
}

type StateBuilder = (state: ProgramState) => ProgramState | null

const runProgramState: (state: ProgramState) => FileTree = state => state.tree

const modifyDirectory: (tree: Dir,path: string[],newFile: FileOutput | DirOutput) => void = (tree,path,newFile) => {
    if(path.length === 0){
        tree.files.push(newFile.type == 'dir' ? 
            {type: 'dir',name: newFile.dirname,files: []} :
            {type: 'file',name: newFile.filename,size: newFile.size}
        )

        return
    }

    return modifyDirectory(tree.files.find(f => f.type == 'dir' && f.name === path[0]) as Dir,path.slice(1),newFile)
}

const cdBuilder: StateBuilder = state => {
    if(state.lines[0].type !== 'cd')
        return null

    const line = state.lines.shift() as CdOutput

    let path: string[] = line.arg === '/' ? [] : line.arg === '..' ? state.currentPath.slice(0,-1) : state.currentPath.concat([line.arg])

    return {
        lines: state.lines,
        tree: state.tree,
        currentPath: path
    }
    /*while(['dir','file'].includes(state.lines[0].type)){

    }*/
}

const fileBuilder: StateBuilder = state => {
    if(state.lines.length === 0 || (state.lines[0].type !== 'file' && state.lines[0].type !== 'dir'))
        return null

    const line = state.lines.shift() as FileOutput | DirOutput

    modifyDirectory(state.tree as Dir,state.currentPath,line)

    return state
}

const lsBuilder: StateBuilder = state => {
    if(state.lines[0].type !== 'ls')
        return null

    state.lines.shift()

    while(fileBuilder(state) !== null) {}

    return state
}

const anyBuilder: StateBuilder = state => cdBuilder(state) || lsBuilder(state) || fileBuilder(state)


const treeWalker: (dir: Dir) => DirSizeTree = dir => {
    const filesSize = dir.files
        .filter(f => f.type === 'file')
        .map(f => (f as File).size)
        .reduce((prev,cur) => prev + cur,0)

    const subDirs = dir.files
        .filter(f => f.type === 'dir')
        .map(f => treeWalker(f as Dir))

    return {
        name: dir.name,
        size: filesSize + subDirs
            .map(x => x.size)
            .reduce((prev,cur) => prev + cur,0),
        subDirs
    }
}

const flattenTree: (dir: DirSizeTree) => Pick<DirSizeTree,"name" | "size">[] = 
    dir => dir.subDirs
        .flatMap(flattenTree)
        .concat([({name: dir.name,size: dir.size})])


const solution: Problem<FileTree,number> = {
    getData(rawInput){
        const output: Output[] = rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => x.split(' '))
            .map(args => {
                if(args[0] === '$'){
                    switch(args[1]){
                        case 'ls':
                            return {
                                type: 'ls',
                            }
                        case 'cd':
                            return {
                                type: 'cd',
                                arg: args[2]
                            }
                        default:
                            throw new Error('fds')
                    }
                }

                if(args[0] === 'dir'){
                    return {type: 'dir',dirname: args[1]}
                }

                if(parseInt(args[0]) != NaN){
                    return {
                        type: 'file',
                        size: parseInt(args[0]),
                        filename: args[1]}
                }

                throw new Error('fds')
            })

        let state: ProgramState = {
            currentPath: [],
            tree: {
                type: 'dir',
                name: '',
                files: []
            },
            lines: output
        }

        while(state.lines.length !== 0){
            state = anyBuilder(state)!
        }

        return runProgramState(state)
    },

    solve1(tree){
        const sizeTree = treeWalker(tree as Dir)

        return flattenTree(sizeTree)
            .filter(d => d.size < 100000)
            .map(d => d.size)
            .reduce((prev,cur) => prev + cur,0)
    },

    solve2(tree){
        const neededSpace = 30000000
        const totalSpace = 70000000

        const rootDir = treeWalker(tree as Dir)

        const usedSpace = rootDir.size

        const remainingSpace = totalSpace - usedSpace
        const diffSpace = neededSpace - remainingSpace

        const sizes = flattenTree(rootDir).map(d => d.size)

        return sizes
            .reduce((prev,cur) =>
                cur > diffSpace && cur < prev ? cur : prev,
            Number.MAX_SAFE_INTEGER)
    }
}

export default wrapSolution(solution)