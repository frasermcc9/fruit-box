export function isNodeInRoot(node: HTMLElement, root: HTMLElement) {
  while (node) {
    if (node === root) {
      return true
    }

    node = node.parentNode as any
  }

  return false
}
