type FileToCheck = {
    id: String;
    fileName: String;
    content: String | null;
};

type FileCountedDetail = {
    id: String;
    fileName: String;
    totalWord: number;
    mostRepeatedWords: Array<WordDetail>;
    errorMessage: String | null;
};

type WordDetail = {
    word: String;
    count: number;
};

// Input: a String containing alphabets, separated: dot (.), comma (,), space ( ).
// Output: FileCountedDetails object
self.onmessage = (event) => {
    const data: FileToCheck = event.data;

    console.log(
        "Worker: Received the text of file name, ",
        data.fileName,
        ", id: ",
        data.id,
        ", content: ",
        data.content,
    );
    const result: FileCountedDetail = {
        id: "hihi",
        fileName: data.fileName,
        totalWord: 0,
        mostRepeatedWords: [],
        errorMessage: null,
    };

    console.log("Problem3: Worker done!");
    postMessage(result);
};
