class StringArraySerializer {
  serialize(array: any): string {
    if (!array) {
      return '';
    }
    let str = '';
    for (const item of array) {
      if (str.length > 0) {
        str += '|';
      }
      str += `${item.key},${item.val}`;
    }
    return str;
  }

  deserialize(str: string): Array<any> {
    if (!str) {
      return [];
    }
    const array = [];
    for (const item of str.split('|')) {
      const kv = item.split(',');
      array.push({
        key: kv[0],
        val: kv[1],
      });
    }
    return array;
  }
}

export default new StringArraySerializer();
