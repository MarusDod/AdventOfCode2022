import Problem from "./problem"

export const fold = <T,A = T>(array: Array<T>,base: A,fn: (prev: A,el: T) => A): A => {
    array.forEach(ar => {
        const res = fn(base,ar)

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

export function scanl <T,B = T>(arr: T[],base: B,fn: (prev: B,cur: T) => B): B[] {
    const ret: B[] = []

    fold(arr,base,(prev,cur) => {
        const res = fn(prev,cur)
        ret.push(res)

        return res
    })

    return ret
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

export const zip: <T,U>(array1: Array<T>,array2: Array<U>) => Array<[T,U]> = (arr1,arr2) => {
    return arr1.map((a,index) => [a,arr2[index]])
}

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