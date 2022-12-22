import Problem from "./problem"

export const fold = <T,A = T>(array: Array<T>,base: A,fn: (prev: A,el: T,index: number) => A): A => {
    array.forEach((ar,index) => {
        const res = fn(base,ar,index)

        if(res){
            base = res
        }
    })

    return base
}

export function* iterate <T>(fn: (X: T) => T,x: T,times?: number): IterableIterator<T> {
    if(times){
        while(times-- !== 0){
            x = fn(x)

            yield x
        }
    }

    else{
        while(true){
            x = fn(x)

            yield x
        }
    }

    return
}

export function* cycle <T>(it: T[]): IterableIterator<T> {
    if(it.length === 0)
        return

    let index = 0

    while(true){
        if(index === it.length)
            index = 0

        yield it[index++]
    }

}

export function scanl <T,B = T>(arr: T[],base: B,fn: (prev: B,cur: T) => B): B[] {
    const ret: B[] = []

    fold(arr,base,(prev,cur) => {
        const res = fn(prev,cur)
        ret.push(res)

        return res
    })

    return ret
}

export function intersection<T>(arr1: T[],arr2: T[],comp: (x:T,y:T) => boolean = (x,y) => x==y): T[] {
    return arr1.filter((a,index) => arr2.find(b => comp(a,b)))
}

export function leftsection<T>(arr1: T[],arr2: T[],comp: (x:T,y:T) => boolean = (x,y) => x==y): T[] {
    return arr1.filter((a,index) => !arr2.find(b => comp(a,b)))
}

export function includesAny<T extends number | string | boolean | null | undefined>(arr1: T[],arr2: T[]): boolean {
    return !!arr1.find(a => arr2.indexOf(a) !== -1)
}

export const minimum = (m: number,n: number): number => m < n ? m : n

export const maximum = (m: number,n: number): number => m > n ? m : n

export const mod = (m: number,n: number): number => ((m % n) + n) % n;

export const fact = (m: number): number => m === 0 ? 1 : m * fact(m-1)

export const range = (min: number,max: number): number[] =>
    Array.from({length: Math.abs(max - min) + 1},(_,index) => minimum(min,max) + index)

export const chunks = <T>(arr: T[],num: number): T[][] => {
    const res: T[][] = []

    arr.forEach((a,index) => {
        if(index % num === 0) {
            res.push([])
        }

        const chunk = res[res.length - 1]

        chunk.push(a)
    })

    return res
}

export const sum = (arr: number[]): number => 
    arr.reduce((prev,cur) => prev+cur,0)

export const product = (arr: number[]): number => 
    arr.reduce((prev,cur) => prev*cur,1)

export const nub = <T>(arr: T[],comp: (x: T,y: T) => boolean): T[] => {
    const filterList: T[] = []

    return arr.filter(a => {
        if(!!filterList.find(val => comp(val,a))){
            return false
        }

        filterList.push(a)

        return true
    })
}

export const takeWhile = <T>(array: Array<T>,callback: (x: T) => boolean): Array<T> => 
    array.reduce((prev,cur) => prev.cont && callback(cur) ? {
            accum: prev.accum.concat([cur]),
            cont: true
        }
        : {
            accum: prev.accum,
            cont: false
        },{cont: true,accum: [] as T[]}).accum

export const dropWhile = <T>(array: Array<T>,callback: (x: T) => boolean): Array<T> => 
    array.reduce((prev,cur) => prev.cont && callback(cur) ? {
            accum: prev.accum,
            cont: true
        }
        : {
            accum: prev.accum.concat([cur]),
            cont: false 
        },{cont: true,accum: [] as T[]}).accum

export const zip: <T,U>(array1: Array<T>,array2: Array<U>,cull?: boolean) => Array<[T,U]> = (arr1,arr2,cull = true) =>
    cull ? 
        arr1.slice(0,arr2.length).map((a,index) => [a,arr2[index]])
        : range(
            0
            ,maximum(arr1.length,arr2.length))
          .map(function(this: {last},i: number){
            this.last = [arr1[i] === undefined ? this.last[0] : arr1[i],arr2[i] === undefined ? this.last[1] : arr2[i]]

            return this.last
        },{last: [undefined,undefined]})

export const stagger = <T>(arr: T[]): [T,T][] => zip(arr,arr.slice(1))

export const wrapSolution: <T,R,S>(solution: Problem<T,R,S>) => (data: string,part: number) => void = solution => (data,part) => {
    const input = solution.getData(data)

    switch(part){
        case 1:
            console.log(solution.solve1(input))
            break;
        case 2:
            console.log(solution.solve2(input))
            break;
    }
}

//console.log(stagger([[1,10],[3,10],[3,12]]))
//console.log(nub([[498,6],[498,7],[498,6]],(x,y) => x[0] === y[0] && x[1] === y[1]))
//console.log(intersection([1,2,3],[4,5,6]))
//console.log(Array.from(iterate(x => x+1,0,10)))