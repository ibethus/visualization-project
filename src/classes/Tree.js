const id = (() => {
  function* UUIDGeneratorNode(id = 0) {
    while (true) {
      yield id++;
    }
  }
  const gen = UUIDGeneratorNode();
  return () => gen.next().value;
})();

export default class Tree {
  #children = new Map();
  #parent = null;
  #index = null;
  #depth = null;
  #id = id();
  #name;
  #data = [];
  constructor(name, index = -1, depth = -1, data) {
    if (!name || typeof name !== "string" || !name.trim().length) {
      throw new Error("Name must be a non empty string");
    }
    this.#name = name;
    this.#index = index;
    this.#depth = depth;
    this.#data = data;
  }

  get name() {
    return this.#name;
  }
  set name(name) {
    this.super(name);
  }
  get id() {
    return this.#id;
  }
  get children() {
    return [...this.#children.values()];
  }
  get index() {
    return this.#index;
  }
  get depth() {
    return this.#depth;
  }
  get parentNode() {
    return this.#parent;
  }
  get data() {
    return this.#data;
  }
  set data(data) {
    this.#data = data;
  }
  set parentNode(parent) {
    if (parent !== this.parent && (parent == null || parent instanceof Tree)) {
      if (this.#parent) {
        this.removeChildNode(this);
      }
      this.#parent = parent;
      if (parent) {
        this.appendChildNode(this);
      }
    }
  }
  get childrenCount() {
    return this.#children.size;
  }

  createNode(name, index, depth, data) {
    const node = new Tree(name, index, depth, data);
    this.#children.set(node.id, node);
    node.parent = this;
    return node;
  }
  appendChildNode(node) {
    if (!(node instanceof Tree) || this.hasChildNode(node)) return;
    if (node === this) throw new Error("A node can not be appened to itself");
    let p = this.parent;
    while (p !== null) {
      if (p === node) throw new Error("A node can not contain an ancestor");
      p = p.parent;
    }

    this.#children.set(node.id, node);
    node.parent = this;
  }
  /*
   * needle can be a name, an id or a node
   *
   */
  hasChildNode(needle) {
    if (needle instanceof Tree) {
      return this.#children.has(needle.id);
    }
    for (let child of this.children) {
      if (child.name === needle || child.id === needle) {
        return true;
      }
    }
    return false;
  }
  /*
   * needle is a string
   * needle is either an id or a name
   */
  getChildNode(needle) {
    for (let child of this.children) {
      if (child.name === needle || child.id === needle) {
        return child;
      }
    }
    return null;
  }

  removeChildNode(needle) {
    if (!this.hasChildNode(needle)) return;
    let node;
    if (needle instanceof Tree) {
      node = needle;
      this.#children.delete(needle.id);
    } else {
      for (let child of this.children) {
        if (child.name === needle || child.id === needle) {
          node = child;
          this.#children.delete(child.id);
          break;
        }
      }
    }
    if (node) {
      node.parent = null;
    }
    return;
  }
  #getTreeString = (node, space = 0) => {
    let str = "\n";
    node.children.forEach((child) => {
      str += `${" ".repeat(space)}${child.name}${this.#getTreeString(
        child,
        space + 2
      )}`;
    });
    return str;
  };

  print() {
    console.log(`\n${this.name}${this.#getTreeString(this, 2)}`);
  }

  json(node = this) {
    const json = {
      name: "",
      children: [],
      depth: node.depth,
      id: node.id,
      index: node.index,
    };
    node.children.forEach((child) => {
      json.name = node.name;
      json.children.push(this.json(child));
    });
    if (node.children.length === 0) json.name = node.name;
    return json;
  }

  traverse(cb) {
    for (let child of this.children) {
      if (cb(child) === true || child.traverse(cb) === true) {
        return true;
      }
    }
  }
  findNodeByName(name) {
    let found = null;
    this.traverse((node) => {
      if (node.name === name) {
        found = node;
        return true;
      }
    });
    return found;
  }
  findAllNodesByName(name) {
    let found = [];
    this.traverse((node) => {
      if (node.name === name) {
        found.push(node);
      }
    });
    return found;
  }
  findAllNodesByDepth(depth) {
    let found = [];
    this.traverse((node) => {
      if (node.depth === depth) {
        found.push(node);
      }
    });
    return found;
  }

  // change data with splice method
  changeNodeData(newData, index, remove = 1) {
    this.#data.splice(index, remove, newData);
  }
}
