import { Queue, Worker, type Processor, type QueueOptions, type WorkerOptions, type ConnectionOptions } from 'bullmq';
import { QUEUE_NAMES, DEFAULT_JOB_OPTIONS, type QueueName } from './definitions';

// Generic Redis connection options
export const defaultConnection: ConnectionOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
};

/**
 * Singleton-like factory for creating Queues.
 * Ensures we don't open too many connections if reused excessively.
 */
export class QueueFactory {
    private static queues: Map<string, Queue> = new Map();

    static getQueue<T = any>(
        name: QueueName, 
        connection: ConnectionOptions = defaultConnection
    ): Queue<T> {
        if (!this.queues.has(name)) {
            const queue = new Queue<T>(name, {
                connection,
                defaultJobOptions: DEFAULT_JOB_OPTIONS,
            });
            this.queues.set(name, queue);
        }
        return this.queues.get(name) as Queue<T>;
    }

    static async closeAll() {
        await Promise.all(
            Array.from(this.queues.values()).map(q => q.close())
        );
        this.queues.clear();
    }
}

/**
 * Factory for creating Workers.
 * Workers should generally be identifying themselves uniquely.
 */
export class WorkerFactory {
    static createWorker<T = any>(
        name: QueueName,
        processor: Processor<T>,
        connection: ConnectionOptions = defaultConnection,
        concurrency: number = 1
    ): Worker<T> {
        const worker = new Worker<T>(name, processor, {
            connection,
            concurrency,
        });

        worker.on('completed', (job) => {
            console.log(`[${name}] Job ${job.id} completed!`);
        });

        worker.on('failed', (job, err) => {
            console.error(`[${name}] Job ${job?.id} failed: ${err.message}`);
        });

        return worker;
    }
}
