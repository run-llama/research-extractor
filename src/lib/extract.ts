"use server"

import { LlamaExtract, ExtractConfig } from "llama-cloud-services";
import { dataSchema } from "./schema";
import { renderMarkdown, ResearchData } from "./markdown";
import dotenv from "dotenv";
import { File as FileBuffer } from "buffer";

dotenv.config()

const extractClient = new LlamaExtract(process.env.LLAMA_CLOUD_API_KEY!, "https://api.cloud.llamaindex.ai")

export async function researchExtractor(file: FileBuffer): Promise<string> {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    let extractedData: any = undefined

    try {
        extractedData = await extractClient.extract(dataSchema, {} as ExtractConfig, undefined, file)
    } catch(error) {
        console.log(error)
    }

    if ("data" in extractedData) {
        return renderMarkdown(extractedData.data as ResearchData)
    } else {
        throw new Error("Failed to extract information from your paper")
    }
}
