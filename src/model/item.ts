export interface File {
  parent: Directory;
  name: string;
  id: number;
  metadata: {
    [key: string]: string,
  };
}

export interface Directory {
  files: File[];
  children: Directory[];
  parent?: Directory; // undefined only for root
  name: string;
}
