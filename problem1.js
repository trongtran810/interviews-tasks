/*
Problem: 
- Input:  Singly Linked List x1 -> x2 -> x3 -> ... -> xn. 
- Output: x1 -> xn -> x2 -> xn-1 -> x3 -> ... 
-------------------
Solution: complexity of O(n), extra memory used: NO.
- Step 1. Reverse the second half of the linked list.
- Step 2. Merge the two halves in an alternating fashion.
-------------------
Ex: 
Input: x1 -> x2 -> x3 -> x4 -> x5
- Step 1. x1 -> x2 -> x3 -> x5 -> x4
- Step2: 
    + x1 -> (x4) -> x2 -> x3 -> x5
    + x1 -> x4 -> x2 -> (x5) -> x3

*/
const EXAMPLE_ARRAY_LENGTH = 10;
// For UI 
const SPACE_BETWEEN_ELEMENTS = 5; 

class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

// Find the middle of a singly linked list
function findMiddle(head) {
  if (!head || !head.next) {
    return head;
  }

  let slow = head;
  let fast = head;

  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}

// Step 1: Reverse the second half of the linked list.
function reverseList(head) {
  let prev = null;
  let current = head;

  while (current) {
    const nextNode = current.next;
    current.next = prev;
    prev = current;
    current = nextNode;
  }

  return prev;
}

// Step 2. Merge the two halves in an alternating fashion.
function mergeLists(first, second) {
  while (second) {
    const firstNext = first.next;
    const secondNext = second.next;

    first.next = second;
    second.next = firstNext;

    first = firstNext;
    second = secondNext;
  }
}

// Call step1, step2
function reorderLinkedList(head) {
  if (!head || !head.next) {
    return head;
  }
  // Step 1
  const middle = findMiddle(head);
  const reversedSecondHalf = reverseList(middle.next);
  middle.next = null;
  // Step 2
  mergeLists(head, reversedSecondHalf);

  return head;
}

// Example Usage:
function createLinkedList(n) {
  if (n <= 0) {
    return null;
  }

  let head = new ListNode(1);
  let current = head;

  for (let i = 2; i <= n; i++) {
    current.next = new ListNode(i);
    current = current.next;
  }

  return head;
}
// Create a sample linked list: 1 -> 2 -> ... -> EXAMPLE_ARRAY_LENGTH
// Head of the input linked link
const head = createLinkedList(EXAMPLE_ARRAY_LENGTH);

// Reorder the linked list
const reorderedList = reorderLinkedList(head);

// Print the reordered linked list
const note =
  "NOTE: To change length of example array, update EXAMPLE_ARRAY_LENGTH value\n----------------------\n";
process.stdout.write(note);
process.stdout.write("The reordered Linked List: \n");
let current = reorderedList;
while (current) {
  process.stdout.write(`${current.val}${(' ').repeat(5)}`);
  current = current.next;
}
