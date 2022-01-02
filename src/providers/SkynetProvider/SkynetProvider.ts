import { IProvider, Item } from "../IProvider";
import MiniSearch from 'minisearch'
import SkynetWrapped, { ISkynet } from "./skynet-js/skynet";

export interface SkynetItem {
    id: string
    text: string
    category: string
}

const MINISEARCH_CONFIG = {
    fields: ['text'],
    storeFields: ['id', 'category', 'text']
}

export class SkynetProvider implements IProvider {
    seed: string
    rootKey: string
    miniSearch: MiniSearch<any>
    engine: ISkynet
    loaded: boolean = false

    constructor(seed: string, rootKey: string, engine: ISkynet = SkynetWrapped) {
        this.seed = seed
        this.rootKey = rootKey
        this.miniSearch = new MiniSearch(MINISEARCH_CONFIG)
        this.engine = engine
    }

    async init(): Promise<void> {
        await this.loadSearchIndex()
    }

    async loadSearchIndex(): Promise<void> {
        const result = await this.engine.getJSON(this.seed, this.rootKey)

        if (result) {
            this.miniSearch = MiniSearch.loadJS(result, MINISEARCH_CONFIG)
        }

        this.loaded = true
    }

    async add(item: Item): Promise<void> {
        if (!this.loaded) {
            await this.loadSearchIndex()
        }

        const json = {
            text: item.text,
            category: 'text'
        }
        const skylink = await this.engine.uploadJSON(this.seed)

        this.miniSearch.add({
            ...json,
            id: skylink
        })

        await this.engine.setJSON(this.seed, this.rootKey, this.miniSearch.toJSON())
    }

    async search(s: string) {
        if (!this.loaded) {
            await this.loadSearchIndex()
        }

        return this.miniSearch.search(s)
    }
}
