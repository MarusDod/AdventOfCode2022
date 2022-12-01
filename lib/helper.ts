export const fold = <T,A>(array: Array<T>,base: A,fn: (el: T, prev: A) => A): A => {
    array.forEach(ar => {
        const res = fn(ar,base)

        if(res){
            base = res
        }
    })

    return base
}
