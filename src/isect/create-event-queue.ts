import SplayTree from "splaytree";

export default function createEventQueue(byY) {
  const priorityQueue = new SplayTree(byY);

  return {
    isEmpty,
    size,
    pop,
    find,
    insert,
  };

  function find(point) {
    return priorityQueue.find(point);
  }

  function size() {
    return priorityQueue.size;
  }

  function isEmpty() {
    return priorityQueue.isEmpty();
  }

  function insert(event) {
    // debugger;
    priorityQueue.add(event.point, event);
  }

  function pop() {
    const node = priorityQueue.pop();

    return node && node.data;
  }
}
