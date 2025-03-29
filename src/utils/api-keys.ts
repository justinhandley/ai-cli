import keytar from 'keytar';
import { SupportedService } from './constants.js';

const SERVICE_NAME = 'ai-cli';

export async function getApiKey(service: SupportedService): Promise<string | null> {
    try {
        return await keytar.getPassword(SERVICE_NAME, service);
    } catch (error) {
        console.error('Error retrieving API key:', error);
        return null;
    }
}

export async function setApiKey(service: SupportedService, apiKey: string): Promise<void> {
    try {
        await keytar.setPassword(SERVICE_NAME, service, apiKey);
    } catch (error) {
        console.error('Error saving API key:', error);
        throw error;
    }
}

export async function deleteApiKey(service: SupportedService): Promise<boolean> {
    try {
        return await keytar.deletePassword(SERVICE_NAME, service);
    } catch (error) {
        console.error('Error deleting API key:', error);
        return false;
    }
}

export async function getConfiguredServices(): Promise<SupportedService[]> {
    try {
        const services = await keytar.findCredentials(SERVICE_NAME);
        return services.map(service => service.account as SupportedService);
    } catch (error) {
        console.error('Error retrieving configured services:', error);
        return [];
    }
}
