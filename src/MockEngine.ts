export class MockEngine {
    static async setJSON(seed: string, root: string, json: any): Promise<void> {}
    static async getJSON(seed: string, root: string): Promise<any> {}
    static async uploadJSON(json: any): Promise<string> { return '' }
    static async downloadJSON(skylink: string): Promise<string> { return ''}
}
