export default interface Problem<T = string,R = string,S = R> {
    getData(rawInput: string): T;

    solve1(input: T): R;
    solve2(input: T): S;
}