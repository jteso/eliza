import { IAgentRuntime } from "@elizaos/core";
import { ErrorAssessmentPipeline } from "../src/clients/pipeline";
import {
    SupportTask,
    AssessmentEvent,
    SplunkEvent,
} from "../src/types/splunk-types";

// Mock implementation of IAgentRuntime
const mockRuntime: IAgentRuntime = {
    // Add necessary mock methods and properties here
    // agentId: "mock-agent-id",
    serverUrl: "http://localhost",
    databaseAdapter: {} as any,
    token: null,
    // modelProvider: {},
    // imageModelProvider: "default",
    // imageVisionModelProvider: "default",
    character: {} as any,
    providers: [],
    actions: [],
    evaluators: [],
    plugins: [],
    fetch: null,
    messageManager: {} as any,
    descriptionManager: {} as any,
    documentsManager: {} as any,
    knowledgeManager: {} as any,
    ragKnowledgeManager: {} as any,
    loreManager: {} as any,
    cacheManager: {} as any,
    services: new Map(),
    clients: {},
    verifiableInferenceAdapter: null,
    initialize: async () => Promise.resolve(),
    registerMemoryManager: () => {},
    getMemoryManager: () => null,
    getService: () => null,
    registerService: () => {},
    getSetting: () => null,
    getConversationLength: () => 0,
    processActions: async () => Promise.resolve(),
    evaluate: async () => Promise.resolve([]),
    ensureParticipantExists: async () => Promise.resolve(),
    ensureUserExists: async () => Promise.resolve(),
    registerAction: () => {},
    ensureConnection: async () => Promise.resolve(),
    ensureParticipantInRoom: async () => Promise.resolve(),
    ensureRoomExists: async () => Promise.resolve(),
    composeState: async () => Promise.resolve({} as any),
    updateRecentMessageState: async () => Promise.resolve({} as any),
} as unknown as IAgentRuntime;

describe("ErrorAssessmentPipeline", () => {
    // mockDatabaseAdapter = {
    //     getMemories: jest.fn(),
    //     createMemory: jest.fn(),
    //     removeMemory: jest.fn(),
    //     removeAllMemories: jest.fn(),
    //     countMemories: jest.fn(),
    //     getCachedEmbeddings: jest.fn(),
    //     searchMemories: jest.fn(),
    //     getMemoriesByRoomIds: jest.fn(),
    //     getMemoryById: jest.fn(),
    // };

    // // mockRuntime = {
    // //     agentId: "test-agent-id" as UUID,
    // //     databaseAdapter: mockDatabaseAdapter,
    // //     cacheManager: new CacheManager(new MemoryCacheAdapter()),
    // // } as unknown as IAgentRuntime;
    // mockRuntime = MOCK_RUNTIME_TEST;

    // memoryManager = new MemoryManager({
    //     tableName: "test_memories",
    //     runtime: mockRuntime,
    // });

    // pipeline = new ErrorAssessmentPipeline(mockRuntime);

    let pipeline: ErrorAssessmentPipeline;

    beforeEach(() => {
        pipeline = new ErrorAssessmentPipeline(mockRuntime);
    });

    test("should add tasks to the pipeline", () => {
        const task1: SupportTask = jest.fn(() =>
            Promise.resolve({ nextEvent: {} as AssessmentEvent })
        );
        const task2: SupportTask = jest.fn(() =>
            Promise.resolve({ nextEvent: {} as AssessmentEvent })
        );

        pipeline.addTask(task1).addTask(task2);

        expect(pipeline["tasks"]).toHaveLength(2);
        expect(pipeline["tasks"][0]).toBe(task1);
        expect(pipeline["tasks"][1]).toBe(task2);
    });

    test("should run tasks in the pipeline", async () => {
        const task1: SupportTask = jest.fn(() =>
            Promise.resolve({ nextEvent: {} as AssessmentEvent })
        );
        const task2: SupportTask = jest.fn(() =>
            Promise.resolve({ nextEvent: undefined })
        ); // This will stop the pipeline
        const task3: SupportTask = jest.fn(() =>
            Promise.resolve({ nextEvent: {} as AssessmentEvent })
        );

        pipeline.addTask(task1).addTask(task2).addTask(task3);

        await pipeline.run({} as SplunkEvent); // Pass a mock event

        expect(task1).toHaveBeenCalled();
        expect(task2).toHaveBeenCalled();
        expect(task3).not.toHaveBeenCalled(); // task3 should not run
    });

    test("should stop execution when a task returns undefined", async () => {
        const task1: SupportTask = jest.fn(() =>
            Promise.resolve({ nextEvent: {} as AssessmentEvent })
        );
        const task2: SupportTask = jest.fn(() =>
            Promise.resolve({ nextEvent: undefined })
        ); // This will stop the pipeline

        pipeline.addTask(task1).addTask(task2);

        await pipeline.run({} as SplunkEvent); // Pass a mock event

        expect(task1).toHaveBeenCalled();
        expect(task2).toHaveBeenCalled();
    });
});
