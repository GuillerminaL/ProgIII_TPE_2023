export class TreeNode<T> {
  constructor(
    public data: T,
    public left: TreeNode<T> | null = null,
    public right: TreeNode<T> | null = null,
  ) {}
}

export class BinarySearchTree<T> {
  private root: TreeNode<T> | null = null;
  private _size = 0;
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  get size(): number {
    return this._size;
  }

  insert(data: T): void {
    this.root = this._insert(this.root, data);
  }

  private _insert(node: TreeNode<T> | null, data: T): TreeNode<T> {
    if (!node) {
      this._size++;
      return new TreeNode(data);
    }
    const cmp = this.compare(data, node.data);
    if (cmp < 0) node.left = this._insert(node.left, data);
    else if (cmp > 0) node.right = this._insert(node.right, data);
    return node;
  }

  search(data: T): boolean {
    return this._search(this.root, data);
  }

  private _search(node: TreeNode<T> | null, data: T): boolean {
    if (!node) return false;
    const cmp = this.compare(data, node.data);
    if (cmp === 0) return true;
    return cmp < 0 ? this._search(node.left, data) : this._search(node.right, data);
  }

  searchPath(data: T): T[] {
    const path: T[] = [];
    this._searchPath(this.root, data, path);
    return path;
  }

  private _searchPath(node: TreeNode<T> | null, data: T, path: T[]): boolean {
    if (!node) return false;
    path.push(node.data);
    const cmp = this.compare(data, node.data);
    if (cmp === 0) return true;
    return cmp < 0 ? this._searchPath(node.left, data, path) : this._searchPath(node.right, data, path);
  }

  inOrder(): T[] {
    const result: T[] = [];
    this._inOrder(this.root, result);
    return result;
  }

  private _inOrder(node: TreeNode<T> | null, result: T[]): void {
    if (!node) return;
    this._inOrder(node.left, result);
    result.push(node.data);
    this._inOrder(node.right, result);
  }

  levelOrder(): T[] {
    const result: T[] = [];
    if (!this.root) return result;
    const queue: TreeNode<T>[] = [this.root];
    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node.data);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return result;
  }

  getRoot(): TreeNode<T> | null {
    return this.root;
  }
}
