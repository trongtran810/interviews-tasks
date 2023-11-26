type FileToCheck = {
    id: string;
    fileName: string;
    content: string | null;
};

type FileCountedDetail = {
    id: string; // Avoid getting result from other worker
    fileName: string;
    fileCountedDetail: ListWordCountedDetail;
};

type WordDetail = {
    word: string;
    count: number;
};

type ListWordCountedDetail = {
    diffWords: number;
    topWords: Array<WordDetail>; // From larger time to smaller
    errorMessage: string | null;
};

const WORD_SEPARATORS = /[.|,|\s]+/;
const CORRECT_TEXT_PATTERN = /^[a-zA-Z.,\s]+$/;
const NUMB_OF_TOP_WORDS = 3;

// Input: a string containing alphabets, separated: dot (.), comma (,), space ( ).
// Output: FileCountedDetails object
self.onmessage = (event) => {
    const data: FileToCheck = event.data;

    console.log(
        "Worker: Received the text of file name, ",
        data.fileName,
        "\n, id: ",
        data.id,
        "\n, content: ",
        data.content,
    );

    const result = wordCounter(data.content);
    result.id = data.id;
    result.fileName = data.fileName;

    console.log("Problem3: Worker done!");
    postMessage(result);
};

const wordCounter = (_text: string | null): FileCountedDetail => {
    const result: FileCountedDetail = {
        id: "",
        fileName: "",
        fileCountedDetail: {
            diffWords: 0,
            topWords: [],
            errorMessage: null,
        },
    };
    // Check input null
    if (_text === null) {
        result.fileCountedDetail.errorMessage =
            "The file contains no more than 3 different words";
        return result;
    }
    // Check correct input
    if (_text !== null && !CORRECT_TEXT_PATTERN.test(_text)) {
        result.fileCountedDetail.errorMessage =
            "The file must contains only alphabetical characters and separator as dot, comma and whitespace characters";
        return result;
    }
    // Count the number of distinct words
    const words = _text.split(WORD_SEPARATORS);
    // lowercase all words
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].toLowerCase();
    }
    // Count the most repeated words
    result.fileCountedDetail = countWords(words);
    return result;
};

const countWords = (wordList: Array<string>): ListWordCountedDetail => {
    const rs: ListWordCountedDetail = {
        diffWords: 0,
        topWords: [],
        errorMessage: null,
    };
    // Calculate a map<word, number> from the wordList
    const wordsMap: Map<string, number> = new Map();
    for (const word of wordList) {
        wordsMap.set(word, (wordsMap.get(word) || 0) + 1);
    }
    rs.diffWords = wordsMap.size;
    if (rs.diffWords < 3) {
        rs.errorMessage = "The file contains less than 3 different words";
        return rs;
    }
    // Get top-level words
    const topWords: Array<string> = [];
    for (let i = 0; i < NUMB_OF_TOP_WORDS; i++) {
        const topWordDt: WordDetail = {
            word: "",
            count: 0,
        };
        for (const word of wordsMap.keys()) {
            const _count = wordsMap.get(word) || 0;
            if (_count > topWordDt.count && !topWords.includes(word)) {
                topWordDt.word = word;
                topWordDt.count = _count;
                topWords.push(topWordDt.word);
            }
        }
        rs.topWords.push(topWordDt);
    }
    return rs;
};
