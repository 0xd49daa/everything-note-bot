export interface Item {
    text: string
}

export interface IProvider {
    init(): void
    add(item: Item): Promise<void>
}