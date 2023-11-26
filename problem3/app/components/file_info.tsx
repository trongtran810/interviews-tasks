"use client";
import React, { useEffect, useState, useMemo } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { toast, TypeOptions as ToastTypeOptions } from "react-toastify";

const NUMB_OF_TOP_WORDS = 3;

const FileInfo = () => {
    const TIME_SHOWING_TOAST = 2000; // in milliseconds,
    const [file, setFile] = useState<File | null>(null);
    const [shouldHighlight, setShouldHighlight] = useState(false);
    const [preventChecking, setPreventChecking] = useState(true);
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

    const notify = (_mess: String, _type: ToastTypeOptions) => {
        toast(_mess, {
            hideProgressBar: true,
            autoClose: TIME_SHOWING_TOAST,
            type: _type,
        });
    };

    const onDropAFile = async (_file: File) => {
        if (_file === null) return;
        // Prevent not txt files
        if (!_file.name.endsWith(".txt")) {
            notify("File must in a .txt extension", "error");
            setPreventChecking(true);
            return;
        }
        setPreventChecking(false);
        const fileContent: String | null = await readFileAsync(_file);

        const _droppedFile = {
            id: uuidv4(),
            fileName: _file.name,
            content: fileContent,
        } as FileToCheck;
        setDroppedFile(_droppedFile);
    };

    const handleChecking = async () => {
        // Process checking
        // Set current file checking, to receive only the last checking result
        setCurFileChecking(droppedFile);
        // Send data to worker
        if (window.Worker) {
            textChecker.postMessage(droppedFile);
        }
        notify("Starting to checking file...", "success");
    };

    function fileDetailComponent() {
        const topWords: Array<WordDetail> =
            fileDetail?.fileCountedDetail?.topWords || [];
        if (topWords.length === 0) {
            for (let i = 0; i < NUMB_OF_TOP_WORDS; i++) {
                topWords.push({
                    word: "",
                    count: 0,
                } as WordDetail);
            }
        }
        return (
            <div className="flex flex-col items-start justify-between p-24 w-full">
                <div className="flex gap-2 mt-2 w-64 my-3">
                    <span className="w-full">Different words:</span>
                    <span className="w-32 text-end font-bold">
                        {fileDetail?.fileCountedDetail.diffWords}
                    </span>
                </div>
                <div>Top words:</div>
                {topWords.map((wordDetail, id) => {
                    return (
                        <div className="flex gap-2 mt-2 w-64" key={id}>
                            <span className="w-full ml-10 italic">
                                {wordDetail.word}
                            </span>
                            <span className="w-32 text-end font-bold">
                                {wordDetail.count === 0 ? "" : wordDetail.count}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    }

    useEffect(() => {
        if (window.Worker) {
            textChecker.onmessage = (e: MessageEvent<FileCountedDetail>) => {
                const _fileDetail = e.data as FileCountedDetail;
                // If the result is matching the current dropped file
                if (_fileDetail.id === droppedFile?.id) {
                    setFileDetail(_fileDetail);
                }
                setFileDetail(_fileDetail);
                console.log("fileDetail: ", _fileDetail);
                notify("Calculate done", "info");
                setPreventChecking(true);
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
                "w-full h-full": true,
                "justify-center": true,
                "p-4 grid cursor-pointer": true,
                "text-violet-500 rounded-lg": true,
                "border-4": true,
                "transition-colors": true,
            })}
        >
            <div className="w-full text-6xl text-center my-20">
                Word Counter
            </div>
            <div
                className={classNames({
                    "flex-1 h-80": true,
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
                                    className="enabled:bg-violet-500 text-violet-50 px-2 py-1 rounded-md bg-violet-300 enabled:hover:bg-violet-400"
                                    disabled={preventChecking}
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
                                        setDroppedFile(null);
                                        setFileDetail(null);
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {fileDetailComponent()}
        </div>
    );
};

export default FileInfo;
