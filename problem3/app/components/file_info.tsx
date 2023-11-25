"use client";
import React, { useEffect, useState, useMemo } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// import { v4 as uuidv4 } from 'uuid';

const FileInfo = () => {
    const [file, setFile] = useState<File | null>(null);
    const [shouldHighlight, setShouldHighlight] = useState(false);
    const [allowChecking, setAllowChecking] = useState(false);
    const [fileDetail, setFileDetail] = useState<FileCountedDetail | null>();
    const [curFileChecking, setCurFileChecking] =
        useState<FileToCheck | null>();
    // Dropped file but not checked
    const [droppedFile, setDroppedFile] = useState<FileToCheck | null>();

    const textChecker: Worker = useMemo(
        () =>
            new Worker(new URL("../workers/file_checker.ts", import.meta.url)),
        [],
    );

    const preventDefaultHandler = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDropAFile = async (_file: File) => {
        if (_file === null) return;
        const fileContent: String | null = await readFileAsync(_file);

        const _droppedFile = {
            id: uuidv4(),
            fileName: _file.name,
            content: fileContent,
        } as FileToCheck;
        setDroppedFile(_droppedFile);
        console.error("mot hai ba");
        // Prevent not txt files
        // Read the file contents
        // Check
        // Save the file contents
    };

    const handleChecking = async () => {
        // Get string data from dropped file
        const UPLOAD_URL = "/api/upload";
        const data = new FormData();
        data.append(file!.name, file!);

        await axios.post(UPLOAD_URL, data);
        // Process checking
        // Set current file checking, to receive only the last checking result
        setCurFileChecking(droppedFile);
        // Send data to worker
        if (window.Worker) {
            textChecker.postMessage(droppedFile);
        }
    };

    useEffect(() => {
        if (window.Worker) {
            textChecker.onmessage = (e: MessageEvent<FileCountedDetail>) => {
                setFileDetail(e.data);
                console.log("Received from worker: " + e.data);
            };
        }
    }, []);

    function readFileAsync(_file: File): Promise<String | null> {
        return new Promise<String | null>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.result) {
                    const content: String | null = reader.result.toString();
                    resolve(content);
                } else {
                    reject(new Error("Failed to read the file"));
                }
            };

            reader.onerror = () => {
                reject(reader.error || new Error("Error reading the file"));
            };

            reader.readAsText(_file);
        });
    }

    return (
        <div
            className={classNames({
                "w-full h-96": true,
                "p-4 grid place-content-center cursor-pointer": true,
                "text-violet-500 rounded-lg": true,
                "border-4 border-dashed ": true,
                "transition-colors": true,
                "border-violet-500 bg-violet-100": shouldHighlight,
                "border-violet-100 bg-violet-50": !shouldHighlight,
            })}
            onDragOver={(e) => {
                preventDefaultHandler(e);
                setShouldHighlight(true);
            }}
            onDragEnter={(e) => {
                preventDefaultHandler(e);
                setShouldHighlight(true);
            }}
            onDragLeave={(e) => {
                preventDefaultHandler(e);
                setShouldHighlight(false);
            }}
            onDrop={(e) => {
                // UI logic, get only one file from the drop
                preventDefaultHandler(e);
                const file = e.dataTransfer.files[0];
                setFile(file);
                setShouldHighlight(false);
                // Do logic businesses
                onDropAFile(file);
            }}
        >
            <div className="flex flex-col items-center">
                {!file ? (
                    <>
                        <CloudArrowUpIcon className="w-10 h-10" />
                        <span>
                            <span>Choose a File</span> or drag it here
                        </span>
                    </>
                ) : (
                    <>
                        <span key={0}>{file.name}</span>
                        <div className="flex gap-2 mt-2">
                            <button
                                className="bg-violet-500 text-violet-50 px-2 py-1 rounded-md disabled:via-violet-50 hover:bg-violet-400"
                                disabled={allowChecking}
                                onClick={() => {
                                    handleChecking();
                                }}
                            >
                                Check
                            </button>
                            <button
                                className="border border-violet-500 px-2 py-1 rounded-md"
                                onClick={() => {
                                    setFile(null);
                                }}
                            >
                                Clear
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FileInfo;
