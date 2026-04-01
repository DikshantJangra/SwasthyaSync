import { Queue } from 'bullmq';
import { redis } from '../redis';

// Only initialize the Queue if redis is available
export const defaultQueue = redis 
  ? new Queue('default', {
      connection: redis,
      defaultJobOptions: {
        removeOnComplete: true,
      }
    })
  : null;

export const addJob = async (name: string, data: any) => {
  if (!defaultQueue) {
    // In dev without Redis, we just skip the background job
    return null;
  }
  
  try {
    return await defaultQueue.add(name, data);
  } catch (error) {
    console.warn(`Could not add job to queue: ${name}`);
    return null;
  }
};
