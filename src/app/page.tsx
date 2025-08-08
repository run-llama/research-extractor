"use client"

import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Upload, File, Check } from "lucide-react";
import { File as FileBuffer } from 'buffer';
import { researchExtractor } from '@/lib/extract';

export default function FileToMarkdownConverter() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Placeholder for your markdown conversion logic
  const convertToMarkdown = async (file: FileBuffer) => {
    // Replace this with your actual conversion logic
    return await researchExtractor(file)
  };

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const handleFileSelect = useCallback(async (file: any) => {
    if (!file) return;

    setSelectedFile(file);
    setError('');
    setIsProcessing(true);

    try {
      const markdown = await convertToMarkdown(file);
      setMarkdownContent(markdown as string);
    } catch (err) {
      setError('Failed to extract information from your paper. Please try again.');
      console.error('Conversion error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const copyToClipboard = async () => {
    if (!markdownContent) return;

    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const resetFile = () => {
    setSelectedFile(null);
    setMarkdownContent('');
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Research Extractor📝</h1>
        <p className="text-muted-foreground">
          Get insights about research papers using <span className='underlined text-blue-500'><a href='https://cloud.llamaindex.ai/'>LlamaExtract🦙</a></span>
        </p>
      </div>

      {/* File Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload File
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <File className="w-12 h-12 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click the button below to select
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file-input" className="sr-only">
                  Choose file
                </Label>
                <Input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  onClick={() => document.getElementById('file-input')?.click()}
                  variant="outline"
                >
                  Choose File
                </Button>
              </div>
            </div>
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <File className="w-4 h-4" />
                <span className="font-medium">{(selectedFile as FileBuffer).name}</span>
                <span className="text-sm text-muted-foreground">
                  ({((selectedFile as FileBuffer).size / 1024).toFixed(2)} KB)
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={resetFile}>
                Remove
              </Button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Processing Indicator */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Extracting information from your file...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Markdown Output Section */}
      {markdownContent && !isProcessing && (
        <>
          <Separator />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Extracted information (as markdown text)</CardTitle>
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="outline"
                className="h-8"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full rounded-md border p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {markdownContent}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Rendered Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full">
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: markdownContent
                      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
                      .replace(/```(.*?)```/gims, '<pre><code>$1</code></pre>')
                      .replace(/`(.*?)`/gim, '<code>$1</code>')
                      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
                      .replace(/\n/gim, '<br>')
                  }}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
