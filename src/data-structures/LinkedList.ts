export class ListNode<T> {
  constructor(
    public data: T,
    public prev: ListNode<T> | null = null,
    public next: ListNode<T> | null = null,
  ) {}
}

export class DoublyLinkedList<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private _size = 0;

  get size(): number {
    return this._size;
  }

  append(data: T): void {
    const node = new ListNode(data);
    if (!this.tail) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this._size++;
  }

  find(predicate: (data: T) => boolean): T | null {
    let current = this.head;
    while (current) {
      if (predicate(current.data)) return current.data;
      current = current.next;
    }
    return null;
  }

  toArray(): T[] {
    const arr: T[] = [];
    let current = this.head;
    while (current) {
      arr.push(current.data);
      current = current.next;
    }
    return arr;
  }

  traverse(): T[] {
    return this.toArray();
  }

  getHead(): ListNode<T> | null {
    return this.head;
  }
}
