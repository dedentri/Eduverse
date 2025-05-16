
import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { getModelConfig, updateModelConfig } from "@/lib/data";
import { ModelConfig as ModelConfigType } from "@/types";

const ModelConfig = () => {
  const [config, setConfig] = useState<ModelConfigType>(getModelConfig());
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      updateModelConfig(config);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI Model Configuration</h2>
          <p className="text-gray-600 mt-1">Configure AI model settings for the English learning chatbot</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Model Link */}
              <div>
                <label htmlFor="modelLink" className="block text-sm font-medium text-gray-700">
                  Model Link (HuggingFace) or Model Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="modelLink"
                    value={config.modelLink}
                    onChange={(e) => setConfig({ ...config, modelLink: e.target.value })}
                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://huggingface.co/..."
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the HuggingFace model link or model name
                </p>
              </div>

              {/* Access Token */}
              <div>
                <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700">
                  Access Token
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    id="accessToken"
                    value={config.accessToken}
                    onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="API Token for accessing the model"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Your API token for accessing the model
                </p>
              </div>

              {/* Chunk Size */}
              <div>
                <label htmlFor="chunkSize" className="block text-sm font-medium text-gray-700">
                  Chunk Size
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="chunkSize"
                    value={config.chunkSize}
                    onChange={(e) => setConfig({ ...config, chunkSize: parseInt(e.target.value) })}
                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Size of text chunks processed by the model
                </p>
              </div>

              {/* Chunk Overlap */}
              <div>
                <label htmlFor="chunkOverlap" className="block text-sm font-medium text-gray-700">
                  Chunk Overlap
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="chunkOverlap"
                    value={config.chunkOverlap}
                    onChange={(e) => setConfig({ ...config, chunkOverlap: parseInt(e.target.value) })}
                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Overlap between consecutive chunks
                </p>
              </div>

              {/* Use CPU or GPU */}
              <div>
                <label htmlFor="useCpuOrGpu" className="block text-sm font-medium text-gray-700">
                  Use CPU or GPU
                </label>
                <div className="mt-1">
                  <select
                    id="useCpuOrGpu"
                    value={config.useCpuOrGpu}
                    onChange={(e) => setConfig({ ...config, useCpuOrGpu: e.target.value as "CPU" | "GPU" })}
                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="CPU">CPU</option>
                    <option value="GPU">GPU</option>
                  </select>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Hardware to use for model inference
                </p>
              </div>

              {/* Return Source Document */}
              <div>
                <div className="flex items-center">
                  <input
                    id="returnSourceDocument"
                    type="checkbox"
                    checked={config.returnSourceDocument}
                    onChange={(e) => setConfig({ ...config, returnSourceDocument: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="returnSourceDocument" className="ml-2 block text-sm text-gray-900">
                    Return Source Document
                  </label>
                </div>
                <p className="mt-1 text-sm text-gray-500 ml-6">
                  Include source document references in AI responses
                </p>
              </div>

              {/* Save button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Configuration"}
                </button>
              </div>

              {/* Status message */}
              {saveStatus === "success" && (
                <div className="p-4 rounded-md bg-green-50 text-green-800">
                  Configuration saved successfully!
                </div>
              )}

              {saveStatus === "error" && (
                <div className="p-4 rounded-md bg-red-50 text-red-800">
                  An error occurred while saving the configuration.
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ModelConfig;
