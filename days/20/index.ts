import { getRandomValues } from "crypto"
import { cycle, dropWhile, fold, includesAny, intersection, iterate, leftsection, maximum, minimum, mod, nub, range, scanl, stagger, sum, takeWhile, wrapSolution, zip } from "../../lib/helper"
import Problem from "../../lib/problem"

type Node<T> = {
    before: Node<T> | undefined,
    after: Node<T> | undefined,
    index: number,
    element: T,
}

class CircularList {
    head: Node<number>
    len: number

    constructor(arr: number[]){
        const nodes: Node<number>[] = arr.map((a,index) => ({
            before: undefined,
            after: undefined,
            index,
            element: a
        }))

        this.len = arr.length

        nodes.forEach((n,i) => {
            switch(i){
                case 0: 
                    n.before = nodes.at(-1)
                    n.after = nodes.at(i+1)
                    break;
                case nodes.length - 1:
                    n.before = nodes.at(i-1)
                    n.after = nodes[0]
                    break;
                default: 
                    n.before = nodes.at(i-1)
                    n.after = nodes[i+1]
            }
        })

        this.head = nodes[0]
    }

    shift(index: number){
        let node = this.head

        while(node.index !== index)
            node = node.after!

        let n = node.element

        if(n > 0){
            while(n-- > 0){
                const after = node.after!
                const before = node.before!

                before.after = after
                after.before = before

                node.before = after
                node.after = after.after!
                node.after.before = node
                node.before.after = node
            }
        }
        else if(n < 0){
            while(n++ < 0){
                const after = node.after!
                const before = node.before!

                before.after = after
                after.before = before

                node.after = before
                node.before = before.before!

                node.before.after = node
                node.after.before = node
            }
        }

        return this
    }

    indexOf(el: number): number{
        let node = this.head
        let i = 0

        while(node.element !== el){
            node = node.after!
            i++
        }

        return i
    }

    node(el: number): Node<number>{
        let node = this.head

        while(node.element !== el){
            node = node.after!
        }

        return node
    }

    toArray(){
        let node = this.head

        const arr: number[] = []

        do {
            arr.push(node.element)
            node = node.after!
        }while(node !== this.head)

        return arr
    }
}

const solution: Problem<number[],number> = {
    getData(rawInput){
        return rawInput
            .split('\n')
            .slice(0,-1)
            .map(x => parseInt(x))
    },

    solve1(coordinates){
        let newCoordinates = fold(
            range(0,coordinates.length-1),
            new CircularList([...coordinates]),
            (prev,cur) => prev.shift(cur))

        let current = newCoordinates.node(0)

        return sum(range(0,2).map(
            x => fold(range(0,999),current,
                (prev,cur) => current = current.after!).element))
    },

    solve2(coordinates){
        const decryptKey = 811589153 

        let newCoordinates = Array.from(iterate(
            coord => {
                console.log('hey')
                return fold(
                    range(0,coord.len-1),
                    coord,
                    (prev,cur,index) => prev.shift(cur))
                }
            ,new CircularList(coordinates.map(x => (x* decryptKey) % (coordinates.length - 1))),10))[9]

        let current = newCoordinates.node(0)

        return sum(range(0,2).map(
            x => coordinates[fold(range(0,999),current,
                (prev,cur) => current = current.after!).index] * decryptKey))
    },
}

export default wrapSolution(solution)