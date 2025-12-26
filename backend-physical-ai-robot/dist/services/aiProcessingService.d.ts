export declare class AIProcessingService {
    private geminiApiKey;
    private geminiUrl;
    constructor(apiKey: string);
    processCommand(userInput: string, robotContext: any): Promise<string>;
    private executeAction;
}
//# sourceMappingURL=aiProcessingService.d.ts.map